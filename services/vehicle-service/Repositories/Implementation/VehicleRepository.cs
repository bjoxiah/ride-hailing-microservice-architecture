using VehicleService.Db;
using VehicleService.Models;
using VehicleService.Repositories.Interface;

namespace VehicleService.Repositories.Implementation;

public class VehicleRepository(VehicleDbContext db) : IVehicleRepository
{
    private readonly VehicleDbContext _db = db;

    public async Task AddAsync(Vehicle vehicle)
    {
        _db.Vehicles.Add(vehicle);
        await _db.SaveChangesAsync();
    }

    public async Task<Vehicle?> GetByIdAsync(Guid id)
    {
        return await _db.Vehicles.FindAsync(id);
    }

    public async Task<Vehicle> UpdateAsync(Vehicle vehicle)
    {
        _db.Vehicles.Update(vehicle);
        await _db.SaveChangesAsync();
        return vehicle;
    }
}