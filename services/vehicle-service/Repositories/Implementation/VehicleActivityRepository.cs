using Microsoft.EntityFrameworkCore;
using VehicleService.Db;
using VehicleService.Models;
using VehicleService.Repositories.Interface;

namespace VehicleService.Repositories.Implementation;

public class VehicleActivityRepository(VehicleDbContext db) : IVehicleActivityRepository
{
    private readonly VehicleDbContext _db = db;

    public async Task AddAsync(VehicleActivity vehicle)
    {
        _db.VehicleActivities.Add(vehicle);
        await _db.SaveChangesAsync();
    }

    public async Task<VehicleActivity?> GetActivityByVehicleIdAsync(Guid vehicleId)
    {
        return await _db.VehicleActivities.FirstOrDefaultAsync(x => x.VehicleId == vehicleId);
    }

    public async Task<List<Vehicle>> GetAvailableVehiclesAsync()
    {
        return await _db.Vehicles
            .Include(v => v.Activity)
            .Where(v => v.Status == VehicleStatus.Approved 
                    && v.Activity != null 
                    && v.Activity.Status == VehicleActivityStatus.Idle)
            .ToListAsync();
    }

    public async Task<VehicleActivity> UpdateAsync(VehicleActivity vehicle)
    {
        _db.VehicleActivities.Update(vehicle);
        await _db.SaveChangesAsync();
        return vehicle;
    }
}