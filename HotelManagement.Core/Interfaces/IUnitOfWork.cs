using HotelManagement.Core.Entities;

namespace HotelManagement.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<User> Users { get; }
    IGenericRepository<Guest> Guests { get; }
    IGenericRepository<Room> Rooms { get; }
    IGenericRepository<RoomType> RoomTypes { get; }
    IGenericRepository<Booking> Bookings { get; }
    IGenericRepository<Payment> Payments { get; }
    IGenericRepository<Service> Services { get; }
    IGenericRepository<ServiceBooking> ServiceBookings { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}