using VehicleService.Models.Dto;
using VehicleService.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace VehicleService.Endpoints;
public static class VehiclesEndpoints
{
    public static void MapVehiclesEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapPost("/vehicles", async (
            [FromServices] IVehicleService service, 
            [FromBody] CreateVehicle dto) =>
        {
            var vehicle = await service.CreateVehicle(dto);
            return Results.Created($"/vehicles/{vehicle.Id}", vehicle);
        });

        routes.MapPut("/vehicles/{id:guid}", async (
            [FromServices] IVehicleService service, 
            [FromBody] UpdateVehicle dto, 
            [FromRoute] Guid id) =>
        {
            var vehicle = await service.UpdateVehicle(dto, id);
            return Results.Created($"/vehicles/{vehicle.Id}", vehicle);
        });
    }
}