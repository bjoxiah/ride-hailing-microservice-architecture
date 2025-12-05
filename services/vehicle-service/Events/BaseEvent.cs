using System.Text.Json.Serialization;

namespace VehicleService.Events;

public class BaseEvent<T>
{
    public Guid EventId { get; init; } = Guid.NewGuid();
    public string EventType { get; init; }

    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;

    public string SourceService { get; init; } = "vehicle-service";

    public Guid? CorrelationId { get; init; }

    public required T Data { get; init; }

    public BaseEvent(T data, string eventType, Guid? correlationId = null)
    {
        Data = data ?? throw new ArgumentNullException(nameof(data));
        EventType = eventType;
        CorrelationId = correlationId;
    }
}

