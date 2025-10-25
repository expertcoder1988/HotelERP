using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.DTOs;

public class CreateRoomTypeDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal BasePrice { get; set; }

    [Required]
    [Range(1, 20)]
    public int MaxOccupancy { get; set; }

    [Required]
    [Range(1, 1000)]
    public int Size { get; set; }

    [MaxLength(1000)]
    public string? Amenities { get; set; }
}

public class UpdateRoomTypeDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal? BasePrice { get; set; }

    [Range(1, 20)]
    public int? MaxOccupancy { get; set; }

    [Range(1, 1000)]
    public int? Size { get; set; }

    [MaxLength(1000)]
    public string? Amenities { get; set; }

    public bool? IsActive { get; set; }
}

public class RoomTypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal BasePrice { get; set; }
    public int MaxOccupancy { get; set; }
    public int Size { get; set; }
    public string? Amenities { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<RoomListDto> Rooms { get; set; } = new();
}