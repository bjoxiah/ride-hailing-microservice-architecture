using VehicleService.Models.Dto;
using VehicleService.Services.Interface;

namespace VehicleService.Endpoints;
public static class VehiclesEndpoints
{
    public static void MapVehiclesEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapPost("/vehicles", async (IVehicleService service, CreateVehicle dto) =>
        {
            var vehicle = await service.CreateVehicle(dto);
            return Results.Created($"/vehicles/{vehicle.Id}", vehicle);
        });

        routes.MapPut("/vehicles/{id:guid}", async (IVehicleService service, UpdateVehicle dto, Guid id) =>
        {
            var vehicle = await service.UpdateVehicle(dto, id);
            return Results.Created($"/vehicles/{vehicle.Id}", vehicle);
        });
    }
}