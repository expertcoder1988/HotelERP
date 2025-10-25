using HotelManagement.Core.DTOs;
using HotelManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<BookingsController> _logger;

    public BookingsController(IBookingRepository bookingRepository, IUnitOfWork unitOfWork, ILogger<BookingsController> logger)
    {
        _bookingRepository = bookingRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingListDto>>> GetBookings(
        [FromQuery] BookingStatus? status = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var bookings = await _bookingRepository.GetAllAsync();
            
            if (status.HasValue)
            {
                bookings = bookings.Where(b => b.Status == status.Value);
            }

            if (startDate.HasValue)
            {
                bookings = bookings.Where(b => b.CheckInDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                bookings = bookings.Where(b => b.CheckOutDate <= endDate.Value);
            }

            var pagedBookings = bookings
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BookingListDto
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
                .ToList();

            return Ok(pagedBookings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving bookings");
            return StatusCode(500, new { message = "An error occurred while retrieving bookings" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDto>> GetBooking(int id)
    {
        try
        {
            var booking = await _bookingRepository.GetBookingWithDetailsAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            var bookingDto = new BookingDto
            {
                Id = booking.Id,
                BookingNumber = booking.BookingNumber,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                NumberOfGuests = booking.NumberOfGuests,
                TotalAmount = booking.TotalAmount,
                PaidAmount = booking.PaidAmount,
                Status = booking.Status,
                SpecialRequests = booking.SpecialRequests,
                Notes = booking.Notes,
                CreatedAt = booking.CreatedAt,
                UpdatedAt = booking.UpdatedAt,
                Guest = new GuestDto
                {
                    Id = booking.Guest.Id,
                    FirstName = booking.Guest.FirstName,
                    LastName = booking.Guest.LastName,
                    Email = booking.Guest.Email,
                    PhoneNumber = booking.Guest.PhoneNumber,
                    Address = booking.Guest.Address,
                    Nationality = booking.Guest.Nationality,
                    PassportNumber = booking.Guest.PassportNumber,
                    DateOfBirth = booking.Guest.DateOfBirth,
                    Gender = booking.Guest.Gender,
                    IsVip = booking.Guest.IsVip,
                    SpecialRequests = booking.Guest.SpecialRequests,
                    CreatedAt = booking.Guest.CreatedAt,
                    UpdatedAt = booking.Guest.UpdatedAt
                },
                Room = new RoomDto
                {
                    Id = booking.Room.Id,
                    RoomNumber = booking.Room.RoomNumber,
                    Floor = booking.Room.Floor,
                    Status = booking.Room.Status,
                    Notes = booking.Room.Notes,
                    IsActive = booking.Room.IsActive,
                    CreatedAt = booking.Room.CreatedAt,
                    UpdatedAt = booking.Room.UpdatedAt,
                    RoomType = new RoomTypeDto
                    {
                        Id = booking.Room.RoomType.Id,
                        Name = booking.Room.RoomType.Name,
                        Description = booking.Room.RoomType.Description,
                        BasePrice = booking.Room.RoomType.BasePrice,
                        MaxOccupancy = booking.Room.RoomType.MaxOccupancy,
                        Size = booking.Room.RoomType.Size,
                        Amenities = booking.Room.RoomType.Amenities,
                        IsActive = booking.Room.RoomType.IsActive,
                        CreatedAt = booking.Room.RoomType.CreatedAt,
                        UpdatedAt = booking.Room.RoomType.UpdatedAt
                    }
                },
                User = booking.User != null ? new UserDto
                {
                    Id = booking.User.Id,
                    FirstName = booking.User.FirstName,
                    LastName = booking.User.LastName,
                    Email = booking.User.Email,
                    PhoneNumber = booking.User.PhoneNumber,
                    Address = booking.User.Address,
                    Role = booking.User.Role,
                    IsActive = booking.User.IsActive,
                    CreatedAt = booking.User.CreatedAt
                } : null,
                Payments = booking.Payments.Select(p => new PaymentDto
                {
                    Id = p.Id,
                    PaymentNumber = p.PaymentNumber,
                    Amount = p.Amount,
                    Method = p.Method,
                    Status = p.Status,
                    TransactionId = p.TransactionId,
                    Notes = p.Notes,
                    CreatedAt = p.CreatedAt,
                    ProcessedAt = p.ProcessedAt,
                    BookingId = p.BookingId,
                    User = p.User != null ? new UserDto
                    {
                        Id = p.User.Id,
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName,
                        Email = p.User.Email,
                        PhoneNumber = p.User.PhoneNumber,
                        Address = p.User.Address,
                        Role = p.User.Role,
                        IsActive = p.User.IsActive,
                        CreatedAt = p.User.CreatedAt
                    } : null
                }).ToList()
            };

            return Ok(bookingDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving booking with ID: {BookingId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the booking" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking(CreateBookingDto createBookingDto)
    {
        try
        {
            // Check if room is available
            var isRoomAvailable = await _bookingRepository.IsRoomAvailableAsync(
                createBookingDto.RoomId, 
                createBookingDto.CheckInDate, 
                createBookingDto.CheckOutDate);

            if (!isRoomAvailable)
            {
                return BadRequest(new { message = "Room is not available for the selected dates" });
            }

            // Get room and calculate total amount
            var room = await _unitOfWork.Rooms.GetByIdAsync(createBookingDto.RoomId);
            if (room == null)
            {
                return BadRequest(new { message = "Room not found" });
            }

            var nights = (createBookingDto.CheckOutDate - createBookingDto.CheckInDate).Days;
            var totalAmount = room.RoomType.BasePrice * nights;

            var booking = new Booking
            {
                BookingNumber = GenerateBookingNumber(),
                GuestId = createBookingDto.GuestId,
                RoomId = createBookingDto.RoomId,
                CheckInDate = createBookingDto.CheckInDate,
                CheckOutDate = createBookingDto.CheckOutDate,
                NumberOfGuests = createBookingDto.NumberOfGuests,
                TotalAmount = totalAmount,
                SpecialRequests = createBookingDto.SpecialRequests,
                Notes = createBookingDto.Notes,
                Status = BookingStatus.Pending,
                UserId = int.Parse(User.FindFirst("nameid")?.Value ?? "0")
            };

            await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.SaveChangesAsync();

            // Return the created booking
            return await GetBooking(booking.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating booking");
            return StatusCode(500, new { message = "An error occurred while creating the booking" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BookingDto>> UpdateBooking(int id, UpdateBookingDto updateBookingDto)
    {
        try
        {
            var booking = await _unitOfWork.Bookings.GetByIdAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            // Check room availability if dates are being changed
            if (updateBookingDto.CheckInDate.HasValue || updateBookingDto.CheckOutDate.HasValue)
            {
                var checkIn = updateBookingDto.CheckInDate ?? booking.CheckInDate;
                var checkOut = updateBookingDto.CheckOutDate ?? booking.CheckOutDate;

                var isRoomAvailable = await _bookingRepository.IsRoomAvailableAsync(
                    booking.RoomId, checkIn, checkOut, id);

                if (!isRoomAvailable)
                {
                    return BadRequest(new { message = "Room is not available for the selected dates" });
                }
            }

            // Update booking properties
            if (updateBookingDto.CheckInDate.HasValue)
                booking.CheckInDate = updateBookingDto.CheckInDate.Value;

            if (updateBookingDto.CheckOutDate.HasValue)
                booking.CheckOutDate = updateBookingDto.CheckOutDate.Value;

            if (updateBookingDto.NumberOfGuests.HasValue)
                booking.NumberOfGuests = updateBookingDto.NumberOfGuests.Value;

            if (updateBookingDto.Status.HasValue)
                booking.Status = updateBookingDto.Status.Value;

            if (updateBookingDto.SpecialRequests != null)
                booking.SpecialRequests = updateBookingDto.SpecialRequests;

            if (updateBookingDto.Notes != null)
                booking.Notes = updateBookingDto.Notes;

            booking.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Bookings.UpdateAsync(booking);
            await _unitOfWork.SaveChangesAsync();

            return await GetBooking(booking.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating booking with ID: {BookingId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the booking" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBooking(int id)
    {
        try
        {
            var booking = await _unitOfWork.Bookings.GetByIdAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            booking.IsDeleted = true;
            booking.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Bookings.UpdateAsync(booking);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "Booking deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting booking with ID: {BookingId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the booking" });
        }
    }

    [HttpGet("upcoming-checkins")]
    public async Task<ActionResult<IEnumerable<BookingListDto>>> GetUpcomingCheckIns([FromQuery] DateTime? date = null)
    {
        try
        {
            var checkInDate = date ?? DateTime.Today;
            var bookings = await _bookingRepository.GetUpcomingCheckInsAsync(checkInDate);

            var bookingDtos = bookings.Select(b => new BookingListDto
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

            return Ok(bookingDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving upcoming check-ins");
            return StatusCode(500, new { message = "An error occurred while retrieving upcoming check-ins" });
        }
    }

    [HttpGet("upcoming-checkouts")]
    public async Task<ActionResult<IEnumerable<BookingListDto>>> GetUpcomingCheckOuts([FromQuery] DateTime? date = null)
    {
        try
        {
            var checkOutDate = date ?? DateTime.Today;
            var bookings = await _bookingRepository.GetUpcomingCheckOutsAsync(checkOutDate);

            var bookingDtos = bookings.Select(b => new BookingListDto
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

            return Ok(bookingDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving upcoming check-outs");
            return StatusCode(500, new { message = "An error occurred while retrieving upcoming check-outs" });
        }
    }

    private static string GenerateBookingNumber()
    {
        return "BK" + DateTime.Now.ToString("yyyyMMddHHmmss") + new Random().Next(1000, 9999);
    }
}