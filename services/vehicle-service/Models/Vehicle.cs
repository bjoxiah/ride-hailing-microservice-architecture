namespace VehicleService.Models
{
    public enum VehicleStatus
    {
        Approved,
        Pending,
        Suspended
    }

    public class Vehicle
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Make { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string Color { get; set; }
        public string LicensePlate { get; set; }
        public VehicleStatus Status { get; set; } = VehicleStatus.Pending;
        public Guid DriverId { get; set; }
        public VehicleActivity? Activity { get; set; }
    }
}