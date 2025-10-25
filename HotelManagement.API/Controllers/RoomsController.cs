using HotelManagement.Core.DTOs;
using HotelManagement.Core.Entities;
using HotelManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RoomsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RoomsController> _logger;

    public RoomsController(IUnitOfWork unitOfWork, ILogger<RoomsController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomListDto>>> GetRooms(
        [FromQuery] int? floor = null,
        [FromQuery] RoomStatus? status = null,
        [FromQuery] int? roomTypeId = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var rooms = await _unitOfWork.Rooms.GetAllAsync();

            if (floor.HasValue)
            {
                rooms = rooms.Where(r => r.Floor == floor.Value);
            }

            if (status.HasValue)
            {
                rooms = rooms.Where(r => r.Status == status.Value);
            }

            if (roomTypeId.HasValue)
            {
                rooms = rooms.Where(r => r.RoomTypeId == roomTypeId.Value);
            }

            if (isActive.HasValue)
            {
                rooms = rooms.Where(r => r.IsActive == isActive.Value);
            }

            var pagedRooms = rooms
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RoomListDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    Floor = r.Floor,
                    RoomTypeName = r.RoomType.Name,
                    BasePrice = r.RoomType.BasePrice,
                    Status = r.Status,
                    IsActive = r.IsActive
                })
                .ToList();

            return Ok(pagedRooms);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving rooms");
            return StatusCode(500, new { message = "An error occurred while retrieving rooms" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoomDto>> GetRoom(int id)
    {
        try
        {
            var room = await _unitOfWork.Rooms.GetByIdAsync(id);
            if (room == null)
            {
                return NotFound(new { message = "Room not found" });
            }

            var roomType = await _unitOfWork.RoomTypes.GetByIdAsync(room.RoomTypeId);

            var roomDto = new RoomDto
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                Floor = room.Floor,
                Status = room.Status,
                Notes = room.Notes,
                IsActive = room.IsActive,
                CreatedAt = room.CreatedAt,
                UpdatedAt = room.UpdatedAt,
                RoomType = new RoomTypeDto
                {
                    Id = roomType!.Id,
                    Name = roomType.Name,
                    Description = roomType.Description,
                    BasePrice = roomType.BasePrice,
                    MaxOccupancy = roomType.MaxOccupancy,
                    Size = roomType.Size,
                    Amenities = roomType.Amenities,
                    IsActive = roomType.IsActive,
                    CreatedAt = roomType.CreatedAt,
                    UpdatedAt = roomType.UpdatedAt
                }
            };

            return Ok(roomDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving room with ID: {RoomId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the room" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<RoomDto>> CreateRoom(CreateRoomDto createRoomDto)
    {
        try
        {
            // Check if room number already exists
            var existingRoom = await _unitOfWork.Rooms.FirstOrDefaultAsync(r => r.RoomNumber == createRoomDto.RoomNumber);
            if (existingRoom != null)
            {
                return BadRequest(new { message = "Room number already exists" });
            }

            // Check if room type exists
            var roomType = await _unitOfWork.RoomTypes.GetByIdAsync(createRoomDto.RoomTypeId);
            if (roomType == null)
            {
                return BadRequest(new { message = "Room type not found" });
            }

            var room = new Room
            {
                RoomNumber = createRoomDto.RoomNumber,
                Floor = createRoomDto.Floor,
                RoomTypeId = createRoomDto.RoomTypeId,
                Notes = createRoomDto.Notes,
                Status = RoomStatus.Available,
                IsActive = true
            };

            await _unitOfWork.Rooms.AddAsync(room);
            await _unitOfWork.SaveChangesAsync();

            return await GetRoom(room.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating room");
            return StatusCode(500, new { message = "An error occurred while creating the room" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<RoomDto>> UpdateRoom(int id, UpdateRoomDto updateRoomDto)
    {
        try
        {
            var room = await _unitOfWork.Rooms.GetByIdAsync(id);
            if (room == null)
            {
                return NotFound(new { message = "Room not found" });
            }

            if (updateRoomDto.Floor.HasValue)
                room.Floor = updateRoomDto.Floor.Value;

            if (updateRoomDto.RoomTypeId.HasValue)
            {
                var roomType = await _unitOfWork.RoomTypes.GetByIdAsync(updateRoomDto.RoomTypeId.Value);
                if (roomType == null)
                {
                    return BadRequest(new { message = "Room type not found" });
                }
                room.RoomTypeId = updateRoomDto.RoomTypeId.Value;
            }

            if (updateRoomDto.Status.HasValue)
                room.Status = updateRoomDto.Status.Value;

            if (updateRoomDto.Notes != null)
                room.Notes = updateRoomDto.Notes;

            if (updateRoomDto.IsActive.HasValue)
                room.IsActive = updateRoomDto.IsActive.Value;

            room.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Rooms.UpdateAsync(room);
            await _unitOfWork.SaveChangesAsync();

            return await GetRoom(room.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating room with ID: {RoomId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the room" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRoom(int id)
    {
        try
        {
            var room = await _unitOfWork.Rooms.GetByIdAsync(id);
            if (room == null)
            {
                return NotFound(new { message = "Room not found" });
            }

            room.IsDeleted = true;
            room.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Rooms.UpdateAsync(room);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "Room deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting room with ID: {RoomId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the room" });
        }
    }

    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<RoomListDto>>> GetAvailableRooms(
        [FromQuery] DateTime? checkIn = null,
        [FromQuery] DateTime? checkOut = null,
        [FromQuery] int? roomTypeId = null)
    {
        try
        {
            var rooms = await _unitOfWork.Rooms.GetAllAsync();
            rooms = rooms.Where(r => r.IsActive && r.Status == RoomStatus.Available);

            if (roomTypeId.HasValue)
            {
                rooms = rooms.Where(r => r.RoomTypeId == roomTypeId.Value);
            }

            // If check-in and check-out dates are provided, check availability
            if (checkIn.HasValue && checkOut.HasValue)
            {
                var bookingRepository = _unitOfWork.Bookings as IBookingRepository;
                if (bookingRepository != null)
                {
                    var availableRooms = new List<Room>();
                    foreach (var room in rooms)
                    {
                        var isAvailable = await bookingRepository.IsRoomAvailableAsync(room.Id, checkIn.Value, checkOut.Value);
                        if (isAvailable)
                        {
                            availableRooms.Add(room);
                        }
                    }
                    rooms = availableRooms;
                }
            }

            var roomDtos = rooms.Select(r => new RoomListDto
            {
                Id = r.Id,
                RoomNumber = r.RoomNumber,
                Floor = r.Floor,
                RoomTypeName = r.RoomType.Name,
                BasePrice = r.RoomType.BasePrice,
                Status = r.Status,
                IsActive = r.IsActive
            }).ToList();

            return Ok(roomDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving available rooms");
            return StatusCode(500, new { message = "An error occurred while retrieving available rooms" });
        }
    }
}