namespace VehicleService.Repositories.Interface;

public interface IRepository<T>
{
    Task AddAsync(T data);
    Task<T> UpdateAsync(T data);
}