using System.ComponentModel.DataAnnotations;

namespace VehicleService.Models.Dto;

public class CreateVehicle
{
    [Required]
    public string Make { get; set; }
    [Required]
    public string Model { get; set; }
    [Required]
    public int Year { get; set; }
    [Required]
    public string Color { get; set; }
    [Required]
    public string LicensePlate { get; set; }
    [Required]
    public Guid DriverId { get; set; }
}

