using VehicleService.Models;

namespace VehicleService.Repositories.Interface;

public interface IVehicleActivityRepository : IRepository<VehicleActivity>
{
    Task<VehicleActivity?> GetActivityByVehicleIdAsync(Guid vehicleId);
    Task<List<Vehicle>> GetAvailableVehiclesAsync();
}
