using VehicleService.Models;
using VehicleService.Models.Dto;

namespace VehicleService.Services.Interface;

public interface IVehicleActivityService
{
    Task<VehicleActivity> UpdateVehicleActivity(UpdateVehicleActivity dto, Guid vehicleId);
}