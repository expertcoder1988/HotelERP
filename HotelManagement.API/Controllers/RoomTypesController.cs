using HotelManagement.Core.DTOs;
using HotelManagement.Core.Entities;
using HotelManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RoomTypesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RoomTypesController> _logger;

    public RoomTypesController(IUnitOfWork unitOfWork, ILogger<RoomTypesController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomTypeDto>>> GetRoomTypes(
        [FromQuery] bool? isActive = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var roomTypes = await _unitOfWork.RoomTypes.GetAllAsync();

            if (isActive.HasValue)
            {
                roomTypes = roomTypes.Where(rt => rt.IsActive == isActive.Value);
            }

            var pagedRoomTypes = roomTypes
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(rt => new RoomTypeDto
                {
                    Id = rt.Id,
                    Name = rt.Name,
                    Description = rt.Description,
                    BasePrice = rt.BasePrice,
                    MaxOccupancy = rt.MaxOccupancy,
                    Size = rt.Size,
                    Amenities = rt.Amenities,
                    IsActive = rt.IsActive,
                    CreatedAt = rt.CreatedAt,
                    UpdatedAt = rt.UpdatedAt
                })
                .ToList();

            return Ok(pagedRoomTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving room types");
            return StatusCode(500, new { message = "An error occurred while retrieving room types" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoomTypeDto>> GetRoomType(int id)
    {
        try
        {
            var roomType = await _unitOfWork.RoomTypes.GetByIdAsync(id);
            if (roomType == null)
            {
                return NotFound(new { message = "Room type not found" });
            }

            var rooms = await _unitOfWork.Rooms.FindAsync(r => r.RoomTypeId == id);

            var roomTypeDto = new RoomTypeDto
            {
                Id = roomType.Id,
                Name = roomType.Name,
                Description = roomType.Description,
                BasePrice = roomType.BasePrice,
                MaxOccupancy = roomType.MaxOccupancy,
                Size = roomType.Size,
                Amenities = roomType.Amenities,
                IsActive = roomType.IsActive,
                CreatedAt = roomType.CreatedAt,
                UpdatedAt = roomType.UpdatedAt,
                Rooms = rooms.Select(r => new RoomListDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    Floor = r.Floor,
                    RoomTypeName = roomType.Name,
                    BasePrice = roomType.BasePrice,
                    Status = r.Status,
                    IsActive = r.IsActive
                }).ToList()
            };

            return Ok(roomTypeDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving room type with ID: {RoomTypeId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the room type" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<RoomTypeDto>> CreateRoomType(CreateRoomTypeDto createRoomTypeDto)
    {
        try
        {
            var roomType = new RoomType
            {
                Name = createRoomTypeDto.Name,
                Description = createRoomTypeDto.Description,
                BasePrice = createRoomTypeDto.BasePrice,
                MaxOccupancy = createRoomTypeDto.MaxOccupancy,
                Size = createRoomTypeDto.Size,
                Amenities = createRoomTypeDto.Amenities,
                IsActive = true
            };

            await _unitOfWork.RoomTypes.AddAsync(roomType);
            await _unitOfWork.SaveChangesAsync();

            var roomTypeDto = new RoomTypeDto
            {
                Id = roomType.Id,
                Name = roomType.Name,
                Description = roomType.Description,
                BasePrice = roomType.BasePrice,
                MaxOccupancy = roomType.MaxOccupancy,
                Size = roomType.Size,
                Amenities = roomType.Amenities,
                IsActive = roomType.IsActive,
                CreatedAt = roomType.CreatedAt,
                UpdatedAt = roomType.UpdatedAt
            };

            return CreatedAtAction(nameof(GetRoomType), new { id = roomType.Id }, roomTypeDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating room type");
            return StatusCode(500, new { message = "An error occurred while creating the room type" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<RoomTypeDto>> UpdateRoomType(int id, UpdateRoomTypeDto updateRoomTypeDto)
    {
        try
        {
            var roomType = await _unitOfWork.RoomTypes.GetByIdAsync(id);
            if (roomType == null)
            {
                return NotFound(new { message = "Room type not found" });
            }

            if (!string.IsNullOrEmpty(updateRoomTypeDto.Name))
                roomType.Name = updateRoomTypeDto.Name;

            if (updateRoomTypeDto.Description != null)
                roomType.Description = updateRoomTypeDto.Description;

            if (updateRoomTypeDto.BasePrice.HasValue)
                roomType.BasePrice = updateRoomTypeDto.BasePrice.Value;

            if (updateRoomTypeDto.MaxOccupancy.HasValue)
                roomType.MaxOccupancy = updateRoomTypeDto.MaxOccupancy.Value;

            if (updateRoomTypeDto.Size.HasValue)
                roomType.Size = updateRoomTypeDto.Size.Value;

            if (updateRoomTypeDto.Amenities != null)
                roomType.Amenities = updateRoomTypeDto.Amenities;

            if (updateRoomTypeDto.IsActive.HasValue)
                roomType.IsActive = updateRoomTypeDto.IsActive.Value;

            roomType.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.RoomTypes.UpdateAsync(roomType);
            await _unitOfWork.SaveChangesAsync();

            return await GetRoomType(roomType.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating room type with ID: {RoomTypeId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the room type" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRoomType(int id)
    {
        try
        {
            var roomType = await _unitOfWork.RoomTypes.GetByIdAsync(id);
            if (roomType == null)
            {
                return NotFound(new { message = "Room type not found" });
            }

            // Check if any rooms are using this room type
            var roomsUsingType = await _unitOfWork.Rooms.FindAsync(r => r.RoomTypeId == id && !r.IsDeleted);
            if (roomsUsingType.Any())
            {
                return BadRequest(new { message = "Cannot delete room type that is being used by rooms" });
            }

            roomType.IsDeleted = true;
            roomType.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.RoomTypes.UpdateAsync(roomType);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "Room type deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting room type with ID: {RoomTypeId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the room type" });
        }
    }
}