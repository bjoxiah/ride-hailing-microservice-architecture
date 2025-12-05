using VehicleService.Models.Dto;
using VehicleService.Services.Interface;

namespace VehicleService.Endpoints;
public static class VehicleActivityEndpoints
{
    public static void MapVehicleActivityEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapPut("/vehicle-activity/{vehicleId:guid}", async (IVehicleActivityService service, UpdateVehicleActivity dto, Guid vehicleId) =>
        {
            var vehicle = await service.UpdateVehicleActivity(dto, vehicleId);
            return Results.Created($"/vehicle-activity/{vehicleId}", vehicle);
        });
    }
}