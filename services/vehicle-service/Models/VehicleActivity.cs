namespace VehicleService.Models
{   
    public enum VehicleActivityStatus
    {
        Idle, // Available
        EnRoute, // Heading to pick up a rider
        Busy, // With a rider
        Offline // Not available
    }

    public class VehicleActivity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid VehicleId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Speed { get; set; }
        public VehicleActivityStatus Status { get; set; } = VehicleActivityStatus.Offline;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Vehicle Vehicle { get; set; } = default!;
    }
}