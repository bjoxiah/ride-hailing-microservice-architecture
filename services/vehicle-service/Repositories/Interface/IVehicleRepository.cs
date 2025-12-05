using VehicleService.Models;

namespace VehicleService.Repositories.Interface;

public interface IVehicleRepository : IRepository<Vehicle>
{
    Task<Vehicle?> GetByIdAsync(Guid id);
}

