using System.Runtime.Serialization;
using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum EventType
{
    [EnumMember(Value = "vehicle.created")]
    VehicleCreated,

    [EnumMember(Value = "vehicle.updated")]
    VehicleUpdated,

    [EnumMember(Value = "vehicle_activity.created")]
    VehicleActivityCreated,

    [EnumMember(Value = "vehicle_activity.updated")]
    VehicleActivityUpdated,

    [EnumMember(Value = "vehicle.assigned")]
    VehicleAssigned,

    [EnumMember(Value = "vehicle.arrived")]
    VehicleArrived,
    [EnumMember(Value = "vehicle.unavalailable")]
    VehicleUnavailable,
}
