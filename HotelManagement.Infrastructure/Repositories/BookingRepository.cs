using HotelManagement.Core.DTOs;
using HotelManagement.Core.Entities;
using HotelManagement.Core.Interfaces;
using HotelManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.Repositories;

public class BookingRepository : GenericRepository<Booking>, IBookingRepository
{
    public BookingRepository(HotelDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Booking>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .Include(b => b.Room.RoomType)
            .Where(b => b.CheckInDate >= startDate && b.CheckOutDate <= endDate)
            .OrderBy(b => b.CheckInDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByGuestIdAsync(int guestId)
    {
        return await _dbSet
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .Include(b => b.Room.RoomType)
            .Where(b => b.GuestId == guestId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByRoomIdAsync(int roomId)
    {
        return await _dbSet
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .Include(b => b.Room.RoomType)
            .Where(b => b.RoomId == roomId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByStatusAsync(BookingStatus status)
    {
        return await _dbSet
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .Include(b => b.Room.RoomType)
            .Where(b => b.Status == status)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<Booking?> GetBookingWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .Include(b => b.Room.RoomType)
            .Include(b => b.User)
            .Include(b => b.Payments)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Booking>> GetUpcomingCheckInsAsync(DateTime date)
    {
        return await _dbSet
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .Include(b => b.Room.RoomType)
            .Where(b => b.CheckInDate.Date == date.Date && b.Status == BookingStatus.Confirmed)
            .OrderBy(b => b.CheckInDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetUpcomingCheckOutsAsync(DateTime date)
    {
        return await _dbSet
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .Include(b => b.Room.RoomType)
            .Where(b => b.CheckOutDate.Date == date.Date && b.Status == BookingStatus.CheckedIn)
            .OrderBy(b => b.CheckOutDate)
            .ToListAsync();
    }

    public async Task<bool> IsRoomAvailableAsync(int roomId, DateTime checkIn, DateTime checkOut, int? excludeBookingId = null)
    {
        var query = _dbSet.Where(b => b.RoomId == roomId &&
                                     b.Status != BookingStatus.Cancelled &&
                                     b.Status != BookingStatus.NoShow &&
                                     ((b.CheckInDate <= checkIn && b.CheckOutDate > checkIn) ||
                                      (b.CheckInDate < checkOut && b.CheckOutDate >= checkOut) ||
                                      (b.CheckInDate >= checkIn && b.CheckOutDate <= checkOut)));

        if (excludeBookingId.HasValue)
        {
            query = query.Where(b => b.Id != excludeBookingId.Value);
        }

        return !await query.AnyAsync();
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var today = DateTime.Today;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);

        var totalRooms = await _context.Rooms.CountAsync(r => r.IsActive);
        var availableRooms = await _context.Rooms.CountAsync(r => r.IsActive && r.Status == RoomStatus.Available);
        var occupiedRooms = await _context.Rooms.CountAsync(r => r.IsActive && r.Status == RoomStatus.Occupied);
        var totalBookings = await _dbSet.CountAsync();
        var pendingBookings = await _dbSet.CountAsync(b => b.Status == BookingStatus.Pending);
        var checkedInGuests = await _dbSet.CountAsync(b => b.Status == BookingStatus.CheckedIn);

        var todayRevenue = await _dbSet
            .Where(b => b.CreatedAt.Date == today && b.Status != BookingStatus.Cancelled)
            .SumAsync(b => b.TotalAmount);

        var monthlyRevenue = await _dbSet
            .Where(b => b.CreatedAt >= startOfMonth && b.Status != BookingStatus.Cancelled)
            .SumAsync(b => b.TotalAmount);

        var totalRevenue = await _dbSet
            .Where(b => b.Status != BookingStatus.Cancelled)
            .SumAsync(b => b.TotalAmount);

        return new DashboardStatsDto
        {
            TotalRooms = totalRooms,
            AvailableRooms = availableRooms,
            OccupiedRooms = occupiedRooms,
            TotalBookings = totalBookings,
            PendingBookings = pendingBookings,
            CheckedInGuests = checkedInGuests,
            TodayRevenue = todayRevenue,
            MonthlyRevenue = monthlyRevenue,
            TotalRevenue = totalRevenue
        };
    }

    public async Task<IEnumerable<RecentBookingDto>> GetRecentBookingsAsync(int count = 10)
    {
        return await _dbSet
            .Include(b => b.Guest)
            .Include(b => b.Room)
            .OrderByDescending(b => b.CreatedAt)
            .Take(count)
            .Select(b => new RecentBookingDto
            {
                Id = b.Id,
                BookingNumber = b.BookingNumber,
                GuestName = b.Guest.FirstName + " " + b.Guest.LastName,
                RoomNumber = b.Room.RoomNumber,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalAmount = b.TotalAmount,
                Status = b.Status
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<RevenueChartDto>> GetRevenueChartDataAsync(int months = 12)
    {
        var startDate = DateTime.Today.AddMonths(-months);
        
        return await _dbSet
            .Where(b => b.CreatedAt >= startDate && b.Status != BookingStatus.Cancelled)
            .GroupBy(b => new { b.CreatedAt.Year, b.CreatedAt.Month })
            .Select(g => new RevenueChartDto
            {
                Period = g.Key.Year + "-" + g.Key.Month.ToString("D2"),
                Revenue = g.Sum(b => b.TotalAmount),
                Bookings = g.Count()
            })
            .OrderBy(r => r.Period)
            .ToListAsync();
    }
}