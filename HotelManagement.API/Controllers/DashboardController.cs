using HotelManagement.Core.DTOs;
using HotelManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IBookingRepository bookingRepository, IUnitOfWork unitOfWork, ILogger<DashboardController> logger)
    {
        _bookingRepository = bookingRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        try
        {
            var stats = await _bookingRepository.GetDashboardStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving dashboard stats");
            return StatusCode(500, new { message = "An error occurred while retrieving dashboard stats" });
        }
    }

    [HttpGet("recent-bookings")]
    public async Task<ActionResult<IEnumerable<RecentBookingDto>>> GetRecentBookings([FromQuery] int count = 10)
    {
        try
        {
            var recentBookings = await _bookingRepository.GetRecentBookingsAsync(count);
            return Ok(recentBookings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving recent bookings");
            return StatusCode(500, new { message = "An error occurred while retrieving recent bookings" });
        }
    }

    [HttpGet("revenue-chart")]
    public async Task<ActionResult<IEnumerable<RevenueChartDto>>> GetRevenueChart([FromQuery] int months = 12)
    {
        try
        {
            var revenueData = await _bookingRepository.GetRevenueChartDataAsync(months);
            return Ok(revenueData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving revenue chart data");
            return StatusCode(500, new { message = "An error occurred while retrieving revenue chart data" });
        }
    }

    [HttpGet("room-occupancy")]
    public async Task<ActionResult<IEnumerable<RoomOccupancyDto>>> GetRoomOccupancy()
    {
        try
        {
            var roomTypes = await _unitOfWork.RoomTypes.GetAllAsync();
            var rooms = await _unitOfWork.Rooms.GetAllAsync();

            var occupancyData = roomTypes.Select(rt =>
            {
                var totalRooms = rooms.Count(r => r.RoomTypeId == rt.Id && r.IsActive);
                var occupiedRooms = rooms.Count(r => r.RoomTypeId == rt.Id && r.IsActive && r.Status == RoomStatus.Occupied);
                var occupancyRate = totalRooms > 0 ? (decimal)occupiedRooms / totalRooms * 100 : 0;

                return new RoomOccupancyDto
                {
                    RoomType = rt.Name,
                    TotalRooms = totalRooms,
                    OccupiedRooms = occupiedRooms,
                    OccupancyRate = Math.Round(occupancyRate, 2)
                };
            }).ToList();

            return Ok(occupancyData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving room occupancy data");
            return StatusCode(500, new { message = "An error occurred while retrieving room occupancy data" });
        }
    }

    [HttpGet("upcoming-checkins")]
    public async Task<ActionResult<IEnumerable<RecentBookingDto>>> GetUpcomingCheckIns([FromQuery] DateTime? date = null)
    {
        try
        {
            var checkInDate = date ?? DateTime.Today;
            var upcomingCheckIns = await _bookingRepository.GetUpcomingCheckInsAsync(checkInDate);

            var checkInDtos = upcomingCheckIns.Select(b => new RecentBookingDto
            {
                Id = b.Id,
                BookingNumber = b.BookingNumber,
                GuestName = b.Guest.FirstName + " " + b.Guest.LastName,
                RoomNumber = b.Room.RoomNumber,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalAmount = b.TotalAmount,
                Status = b.Status
            }).ToList();

            return Ok(checkInDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving upcoming check-ins");
            return StatusCode(500, new { message = "An error occurred while retrieving upcoming check-ins" });
        }
    }

    [HttpGet("upcoming-checkouts")]
    public async Task<ActionResult<IEnumerable<RecentBookingDto>>> GetUpcomingCheckOuts([FromQuery] DateTime? date = null)
    {
        try
        {
            var checkOutDate = date ?? DateTime.Today;
            var upcomingCheckOuts = await _bookingRepository.GetUpcomingCheckOutsAsync(checkOutDate);

            var checkOutDtos = upcomingCheckOuts.Select(b => new RecentBookingDto
            {
                Id = b.Id,
                BookingNumber = b.BookingNumber,
                GuestName = b.Guest.FirstName + " " + b.Guest.LastName,
                RoomNumber = b.Room.RoomNumber,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalAmount = b.TotalAmount,
                Status = b.Status
            }).ToList();

            return Ok(checkOutDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving upcoming check-outs");
            return StatusCode(500, new { message = "An error occurred while retrieving upcoming check-outs" });
        }
    }
}