using HotelManagement.Core.Entities;
using HotelManagement.Core.Interfaces;
using HotelManagement.Infrastructure.Data;

namespace HotelManagement.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly HotelDbContext _context;
    private IGenericRepository<User>? _users;
    private IGenericRepository<Guest>? _guests;
    private IGenericRepository<Room>? _rooms;
    private IGenericRepository<RoomType>? _roomTypes;
    private IGenericRepository<Booking>? _bookings;
    private IGenericRepository<Payment>? _payments;
    private IGenericRepository<Service>? _services;
    private IGenericRepository<ServiceBooking>? _serviceBookings;

    public UnitOfWork(HotelDbContext context)
    {
        _context = context;
    }

    public IGenericRepository<User> Users =>
        _users ??= new GenericRepository<User>(_context);

    public IGenericRepository<Guest> Guests =>
        _guests ??= new GenericRepository<Guest>(_context);

    public IGenericRepository<Room> Rooms =>
        _rooms ??= new GenericRepository<Room>(_context);

    public IGenericRepository<RoomType> RoomTypes =>
        _roomTypes ??= new GenericRepository<RoomType>(_context);

    public IGenericRepository<Booking> Bookings =>
        _bookings ??= new BookingRepository(_context);

    public IGenericRepository<Payment> Payments =>
        _payments ??= new GenericRepository<Payment>(_context);

    public IGenericRepository<Service> Services =>
        _services ??= new GenericRepository<Service>(_context);

    public IGenericRepository<ServiceBooking> ServiceBookings =>
        _serviceBookings ??= new GenericRepository<ServiceBooking>(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        await _context.Database.CommitTransactionAsync();
    }

    public async Task RollbackTransactionAsync()
    {
        await _context.Database.RollbackTransactionAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}