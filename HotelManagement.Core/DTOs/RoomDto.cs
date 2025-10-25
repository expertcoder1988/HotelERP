using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.DTOs;

public class CreateRoomDto
{
    [Required]
    [MaxLength(10)]
    public string RoomNumber { get; set; } = string.Empty;

    [Required]
    public int Floor { get; set; }

    [Required]
    public int RoomTypeId { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateRoomDto
{
    public int? Floor { get; set; }
    public int? RoomTypeId { get; set; }
    public RoomStatus? Status { get; set; }
    public string? Notes { get; set; }
    public bool? IsActive { get; set; }
}

public class RoomDto
{
    public int Id { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
    public RoomStatus Status { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public RoomTypeDto RoomType { get; set; } = null!;
}

public class RoomListDto
{
    public int Id { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
    public string RoomTypeName { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public RoomStatus Status { get; set; }
    public bool IsActive { get; set; }
}