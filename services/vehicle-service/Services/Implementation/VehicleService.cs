using Microsoft.OpenApi;
using VehicleService.Events;
using VehicleService.Kafka;
using VehicleService.Models;
using VehicleService.Models.Dto;
using VehicleService.Repositories.Interface;
using VehicleService.Services.Interface;
using VehicleService.Extensions;

namespace VehicleService.Services.Implementation;

public class VehicleService(
    IVehicleRepository repository,
    KafkaProducer kafkaProducer
) : IVehicleService
{
    private readonly IVehicleRepository _repository = repository;
    private readonly KafkaProducer _kafkaProducer = kafkaProducer;
    public async Task<Vehicle> CreateVehicle(CreateVehicle dto)
    {
        //TODO: Add validation logic here [Fluent Validation]
        //TODO: Can use automapper here to map dto to entity

        var vehicle = new Vehicle
        {
            Make = dto.Make,
            Model = dto.Model,
            Year = dto.Year,
            LicensePlate = dto.LicensePlate,
            Color = dto.Color,
            DriverId = dto.DriverId,
            Status = VehicleStatus.Pending
        };

        await _repository.AddAsync(vehicle);

        //TODO: Emit Kafka Event here for Vehicle Created
        var @event = new BaseEvent<Vehicle>(vehicle, EventType.VehicleCreated.GetEnumMemberValue(), Guid.NewGuid()) { Data = vehicle };
        await _kafkaProducer.ProduceAsync(EventType.VehicleCreated.GetEnumMemberValue(), @event);
        return vehicle;
    }

    public async Task<Vehicle> UpdateVehicle(UpdateVehicle dto, Guid id)
    {
        var existingVehicle = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Vehicle with ID {id} not found.");

        // Update fields
        existingVehicle.Make = dto.Make;
        existingVehicle.Model = dto.Model;
        existingVehicle.Year = dto.Year;
        existingVehicle.LicensePlate = dto.LicensePlate;
        existingVehicle.Color = dto.Color;
        existingVehicle.Status = dto.Status;

        var updatedVehicle = await _repository.UpdateAsync(existingVehicle);
        // Emit Kafka Event here for Vehicle Updated
        var @event = new BaseEvent<Vehicle>(updatedVehicle, EventType.VehicleUpdated.GetEnumMemberValue(), Guid.NewGuid()) { Data = updatedVehicle };
        await _kafkaProducer.ProduceAsync(EventType.VehicleUpdated.GetEnumMemberValue(), @event);
        return updatedVehicle;
    }
}