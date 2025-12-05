using VehicleService.Models.Dto;
using VehicleService.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace VehicleService.Endpoints;
public static class VehicleActivityEndpoints
{
    public static void MapVehicleActivityEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapPut("/vehicle-activity/{vehicleId:guid}", async (
            [FromServices] IVehicleActivityService service, 
            [FromBody] UpdateVehicleActivity dto, 
            [FromRoute] Guid vehicleId) =>
        {
            var vehicle = await service.UpdateVehicleActivity(dto, vehicleId);
            return Results.Created($"/vehicle-activity/{vehicleId}", vehicle);
        });
    }
}