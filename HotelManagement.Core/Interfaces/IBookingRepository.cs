using HotelManagement.Core.DTOs;
using HotelManagement.Core.Entities;

namespace HotelManagement.Core.Interfaces;

public interface IBookingRepository : IGenericRepository<Booking>
{
    Task<IEnumerable<Booking>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Booking>> GetBookingsByGuestIdAsync(int guestId);
    Task<IEnumerable<Booking>> GetBookingsByRoomIdAsync(int roomId);
    Task<IEnumerable<Booking>> GetBookingsByStatusAsync(BookingStatus status);
    Task<Booking?> GetBookingWithDetailsAsync(int id);
    Task<IEnumerable<Booking>> GetUpcomingCheckInsAsync(DateTime date);
    Task<IEnumerable<Booking>> GetUpcomingCheckOutsAsync(DateTime date);
    Task<bool> IsRoomAvailableAsync(int roomId, DateTime checkIn, DateTime checkOut, int? excludeBookingId = null);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<IEnumerable<RecentBookingDto>> GetRecentBookingsAsync(int count = 10);
    Task<IEnumerable<RevenueChartDto>> GetRevenueChartDataAsync(int months = 12);
}