using System.ComponentModel.DataAnnotations;

namespace VehicleService.Models.Dto
{
    public class UpdateVehicleActivity
    {
        [Required]
        public double Latitude { get; set; }
        [Required]
        public double Longitude { get; set; }
        [Required]
        public double Speed { get; set; }
        [Required]
        public VehicleActivityStatus Status { get; set; } = VehicleActivityStatus.Offline;
    }
}