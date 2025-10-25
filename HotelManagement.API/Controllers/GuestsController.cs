using HotelManagement.Core.DTOs;
using HotelManagement.Core.Entities;
using HotelManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GuestsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GuestsController> _logger;

    public GuestsController(IUnitOfWork unitOfWork, ILogger<GuestsController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GuestDto>>> GetGuests(
        [FromQuery] string? search = null,
        [FromQuery] bool? isVip = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var guests = await _unitOfWork.Guests.GetAllAsync();

            if (!string.IsNullOrEmpty(search))
            {
                guests = guests.Where(g => 
                    g.FirstName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    g.LastName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    g.Email!.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    g.PhoneNumber!.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            if (isVip.HasValue)
            {
                guests = guests.Where(g => g.IsVip == isVip.Value);
            }

            var pagedGuests = guests
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(g => new GuestDto
                {
                    Id = g.Id,
                    FirstName = g.FirstName,
                    LastName = g.LastName,
                    Email = g.Email,
                    PhoneNumber = g.PhoneNumber,
                    Address = g.Address,
                    Nationality = g.Nationality,
                    PassportNumber = g.PassportNumber,
                    DateOfBirth = g.DateOfBirth,
                    Gender = g.Gender,
                    IsVip = g.IsVip,
                    SpecialRequests = g.SpecialRequests,
                    CreatedAt = g.CreatedAt,
                    UpdatedAt = g.UpdatedAt
                })
                .ToList();

            return Ok(pagedGuests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving guests");
            return StatusCode(500, new { message = "An error occurred while retrieving guests" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GuestDto>> GetGuest(int id)
    {
        try
        {
            var guest = await _unitOfWork.Guests.GetByIdAsync(id);
            if (guest == null)
            {
                return NotFound(new { message = "Guest not found" });
            }

            var guestDto = new GuestDto
            {
                Id = guest.Id,
                FirstName = guest.FirstName,
                LastName = guest.LastName,
                Email = guest.Email,
                PhoneNumber = guest.PhoneNumber,
                Address = guest.Address,
                Nationality = guest.Nationality,
                PassportNumber = guest.PassportNumber,
                DateOfBirth = guest.DateOfBirth,
                Gender = guest.Gender,
                IsVip = guest.IsVip,
                SpecialRequests = guest.SpecialRequests,
                CreatedAt = guest.CreatedAt,
                UpdatedAt = guest.UpdatedAt,
                Bookings = guest.Bookings.Select(b => new BookingListDto
                {
                    Id = b.Id,
                    BookingNumber = b.BookingNumber,
                    GuestName = b.Guest.FirstName + " " + b.Guest.LastName,
                    RoomNumber = b.Room.RoomNumber,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    TotalAmount = b.TotalAmount,
                    Status = b.Status
                }).ToList()
            };

            return Ok(guestDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving guest with ID: {GuestId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the guest" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<GuestDto>> CreateGuest(CreateGuestDto createGuestDto)
    {
        try
        {
            var guest = new Guest
            {
                FirstName = createGuestDto.FirstName,
                LastName = createGuestDto.LastName,
                Email = createGuestDto.Email,
                PhoneNumber = createGuestDto.PhoneNumber,
                Address = createGuestDto.Address,
                Nationality = createGuestDto.Nationality,
                PassportNumber = createGuestDto.PassportNumber,
                DateOfBirth = createGuestDto.DateOfBirth,
                Gender = createGuestDto.Gender,
                IsVip = createGuestDto.IsVip,
                SpecialRequests = createGuestDto.SpecialRequests
            };

            await _unitOfWork.Guests.AddAsync(guest);
            await _unitOfWork.SaveChangesAsync();

            var guestDto = new GuestDto
            {
                Id = guest.Id,
                FirstName = guest.FirstName,
                LastName = guest.LastName,
                Email = guest.Email,
                PhoneNumber = guest.PhoneNumber,
                Address = guest.Address,
                Nationality = guest.Nationality,
                PassportNumber = guest.PassportNumber,
                DateOfBirth = guest.DateOfBirth,
                Gender = guest.Gender,
                IsVip = guest.IsVip,
                SpecialRequests = guest.SpecialRequests,
                CreatedAt = guest.CreatedAt,
                UpdatedAt = guest.UpdatedAt
            };

            return CreatedAtAction(nameof(GetGuest), new { id = guest.Id }, guestDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating guest");
            return StatusCode(500, new { message = "An error occurred while creating the guest" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<GuestDto>> UpdateGuest(int id, UpdateGuestDto updateGuestDto)
    {
        try
        {
            var guest = await _unitOfWork.Guests.GetByIdAsync(id);
            if (guest == null)
            {
                return NotFound(new { message = "Guest not found" });
            }

            if (!string.IsNullOrEmpty(updateGuestDto.FirstName))
                guest.FirstName = updateGuestDto.FirstName;

            if (!string.IsNullOrEmpty(updateGuestDto.LastName))
                guest.LastName = updateGuestDto.LastName;

            if (updateGuestDto.Email != null)
                guest.Email = updateGuestDto.Email;

            if (updateGuestDto.PhoneNumber != null)
                guest.PhoneNumber = updateGuestDto.PhoneNumber;

            if (updateGuestDto.Address != null)
                guest.Address = updateGuestDto.Address;

            if (updateGuestDto.Nationality != null)
                guest.Nationality = updateGuestDto.Nationality;

            if (updateGuestDto.PassportNumber != null)
                guest.PassportNumber = updateGuestDto.PassportNumber;

            if (updateGuestDto.DateOfBirth.HasValue)
                guest.DateOfBirth = updateGuestDto.DateOfBirth;

            if (updateGuestDto.Gender != null)
                guest.Gender = updateGuestDto.Gender;

            if (updateGuestDto.IsVip.HasValue)
                guest.IsVip = updateGuestDto.IsVip.Value;

            if (updateGuestDto.SpecialRequests != null)
                guest.SpecialRequests = updateGuestDto.SpecialRequests;

            guest.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Guests.UpdateAsync(guest);
            await _unitOfWork.SaveChangesAsync();

            return await GetGuest(guest.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating guest with ID: {GuestId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the guest" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGuest(int id)
    {
        try
        {
            var guest = await _unitOfWork.Guests.GetByIdAsync(id);
            if (guest == null)
            {
                return NotFound(new { message = "Guest not found" });
            }

            guest.IsDeleted = true;
            guest.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Guests.UpdateAsync(guest);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "Guest deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting guest with ID: {GuestId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the guest" });
        }
    }
}