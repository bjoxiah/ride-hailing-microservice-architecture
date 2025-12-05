using VehicleService.Models;
using VehicleService.Models.Dto;

namespace VehicleService.Services.Interface;

public interface IVehicleService
{
    Task<Vehicle> CreateVehicle(CreateVehicle dto);
    Task<Vehicle> UpdateVehicle(UpdateVehicle dto, Guid id);
}