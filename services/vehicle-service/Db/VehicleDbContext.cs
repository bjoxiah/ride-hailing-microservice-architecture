using Microsoft.EntityFrameworkCore;
using VehicleService.Models;

namespace VehicleService.Db;

public class VehicleDbContext(DbContextOptions<VehicleDbContext> options) : DbContext(options)
{
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<VehicleActivity> VehicleActivities => Set<VehicleActivity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Activity)
            .WithOne(a => a.Vehicle)
            .HasForeignKey<VehicleActivity>(a => a.VehicleId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Ensure VehicleId is UNIQUE (EF will create unique index automatically)
        modelBuilder.Entity<VehicleActivity>()
            .HasIndex(a => a.VehicleId)
            .IsUnique();
    }
}