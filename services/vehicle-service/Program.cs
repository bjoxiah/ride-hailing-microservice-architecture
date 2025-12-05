using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VehicleService.Db;
using VehicleService.Repositories.Interface;
using VehicleService.Repositories.Implementation;
using IVehicleService = VehicleService.Services.Interface.IVehicleService;
using VehicleServiceImpl = VehicleService.Services.Implementation.VehicleService;
using VehicleService.Endpoints;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Prometheus;
using Confluent.Kafka;
using VehicleService.Kafka;
using VehicleService.Middleware;

var builder = WebApplication.CreateBuilder(args);

// === CONFIGURATION/ENV (example defaults) ===
var serviceName = "vehicle-service";
var serviceVersion = "1.0.0";
var jaegerHost = builder.Configuration.GetValue<string>("OpenTelemetry:Host") ?? "otel-collector";
var jaegerPort = builder.Configuration.GetValue<int?>("OpenTelemetry:Port") ?? 4317;

// === Add OpenTelemetry Tracing ===
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource
        .AddService(serviceName: serviceName, serviceVersion: serviceVersion))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSource(serviceName)
        .AddOtlpExporter(options =>
        {
            // The default is OTLP/gRPC to port 4317, which matches your settings
            options.Endpoint = new Uri($"http://{jaegerHost}:{jaegerPort}");
        }));

// -------------------------
// Configure Services / DI
// -------------------------

// PostgreSQL DbContext
builder.Services.AddDbContext<VehicleDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

// Repositories
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IVehicleActivityRepository, VehicleActivityRepository>();

// Services
builder.Services.AddScoped<IVehicleService, VehicleServiceImpl>();

// Configure JSON serialization (snake_case)
builder.Services.ConfigureHttpJsonOptions(opts =>
{
    opts.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
    opts.SerializerOptions.WriteIndented = true; // optional: pretty-print JSON
});

// === Kafka config (Confluent) - add as singleton config or wrapper ===
builder.Services.AddSingleton<ProducerConfig>(sp =>
{
    return new ProducerConfig
    {
        BootstrapServers = builder.Configuration.GetValue<string>("Kafka:Host") ?? "redpanda:9092",
        // any other producer config: acks, retries, idempotence etc.
        Acks = Acks.Leader,
        MessageSendMaxRetries = 3
    };
});

// Add a typed Kafka client wrapper
builder.Services.AddSingleton<KafkaProducer>();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "VehicleServiceAPI";
    config.Title = "Vehicle Service API";
    config.Version = "v1";
});

// -------------------------
// Build Application
// -------------------------
var app = builder.Build();

// Global error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var db = services.GetRequiredService<VehicleDbContext>();
    
    var retries = 10;
    var delay = TimeSpan.FromSeconds(3);
    
    for (int i = 0; i < retries; i++)
    {
        try
        {
            logger.LogInformation("Attempting to apply database migrations (attempt {Attempt}/{MaxRetries})...", i + 1, retries);
            db.Database.Migrate();
            logger.LogInformation("Database migrations applied successfully.");
            break;
        }
        catch (Exception ex)
        {
            if (i == retries - 1)
            {
                logger.LogError(ex, "Failed to apply database migrations after {Retries} attempts.", retries);
                throw;
            }
            logger.LogWarning("Database not ready, waiting {Delay} seconds before retry... (attempt {Attempt}/{MaxRetries})", delay.TotalSeconds, i + 1, retries);
            Thread.Sleep(delay);
        }
    }
}

// Prometheus metrics endpoint
app.UseHttpMetrics(); // prometheus-net instrumentation for HTTP

app.MapMetrics(); // exposes /metrics endpoint

// Map Minimal API endpoints
app.MapVehiclesEndpoints();
app.MapVehicleActivityEndpoints();

// Swagger / OpenAPI middleware (only in development)
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "Vehicle Service API Docs";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}


// Run the application
app.Run();