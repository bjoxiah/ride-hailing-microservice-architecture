using Microsoft.OpenApi;
using VehicleService.Events;
using VehicleService.Kafka;
using VehicleService.Models;
using VehicleService.Models.Dto;
using VehicleService.Repositories.Interface;
using VehicleService.Services.Interface;
using VehicleService.Extensions;

namespace VehicleService.Services.Implementation;

public class VehicleActivityService(
    IVehicleActivityRepository repository,
    KafkaProducer kafkaProducer) : IVehicleActivityService
{
    private readonly IVehicleActivityRepository _repository = repository;
    private readonly KafkaProducer _kafkaProducer = kafkaProducer;
    public async Task<VehicleActivity> UpdateVehicleActivity(UpdateVehicleActivity dto, Guid vehicleId)
    {
        var existingVehicleActivity = await _repository.GetActivityByVehicleIdAsync(vehicleId);

        if (existingVehicleActivity == null)
        {
            // Create new VehicleActivity if it doesn't exist
            var newVehicleActivity = new VehicleActivity
            {
                VehicleId = vehicleId,
                Status = dto.Status,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Speed = dto.Speed,
            };
            await _repository.AddAsync(newVehicleActivity);
            //Emit Kafka Event here for Vehicle Activity Created
            var @eventCreated = new BaseEvent<VehicleActivity>(newVehicleActivity, EventType.VehicleActivityCreated.GetEnumMemberValue(), Guid.NewGuid()) { Data = newVehicleActivity };
            await _kafkaProducer.ProduceAsync(EventType.VehicleActivityCreated.GetEnumMemberValue(), @eventCreated); 
       
            return newVehicleActivity;
        }

        // Update fields
        existingVehicleActivity.Status = dto.Status;
        existingVehicleActivity.Longitude = dto.Longitude;
        existingVehicleActivity.Latitude = dto.Latitude;
        existingVehicleActivity.Speed = dto.Speed;

        var updatedVehicleActivity = await _repository.UpdateAsync(existingVehicleActivity);
        //Emit Kafka Event here for Vehicle Updated
        var @event = new BaseEvent<VehicleActivity>(updatedVehicleActivity, EventType.VehicleActivityUpdated.GetEnumMemberValue(), Guid.NewGuid()) { Data = updatedVehicleActivity };
        
        await _kafkaProducer.ProduceAsync(EventType.VehicleActivityUpdated.GetEnumMemberValue(), @event);
        return updatedVehicleActivity;
    }
}