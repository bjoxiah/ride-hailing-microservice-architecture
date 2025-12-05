// -------------------------------
// KafkaProducer wrapper with trace propagation
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Confluent.Kafka;

namespace VehicleService.Kafka;
public class KafkaProducer
{
    private readonly ProducerConfig _config;
    private readonly ActivitySource _activitySource = new("vehicle-service");
    private readonly JsonSerializerOptions _jsonOptions;

    public KafkaProducer(ProducerConfig config)
    {
        _config = config;
        // Use the same JSON options as HTTP endpoints (snake_case)
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            WriteIndented = false,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };
    }

    public async Task ProduceAsync<T>(string topic, T payload)
    {
        using var producer = new ProducerBuilder<string, string>(_config).Build();
        var key = Guid.NewGuid().ToString();
        var value = JsonSerializer.Serialize(payload, _jsonOptions);

        using var activity = _activitySource.StartActivity("kafka.produce", ActivityKind.Producer);
        // add attributes to span
        activity?.SetTag("messaging.system", "kafka");
        activity?.SetTag("messaging.destination", topic);
        activity?.SetTag("messaging.kafka.message_key", key);

        // create headers and inject traceparent
        var headers = new Headers();
        if (activity is not null)
        {
            // W3C traceparent
            var traceparent = activity.Id; // Activity.Id is W3C format when DefaultIdFormat = W3C
            headers.Add("traceparent", Encoding.UTF8.GetBytes(traceparent));
            // if you want baggage, inject items individually
        }

        var msg = new Message<string, string>
        {
            Key = key,
            Value = value,
            Headers = headers
        };

        // send
        var result = await producer.ProduceAsync(topic, msg);
        activity?.SetTag("messaging.kafka.partition", result.Partition.Value);
        activity?.SetTag("messaging.kafka.offset", result.Offset.Value);
    }
}