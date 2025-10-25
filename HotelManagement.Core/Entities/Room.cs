using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.Entities;

public class Room : BaseEntity
{
    [Required]
    [MaxLength(10)]
    public string RoomNumber { get; set; } = string.Empty;

    [Required]
    public int Floor { get; set; }

    public RoomStatus Status { get; set; } = RoomStatus.Available;

    [MaxLength(500)]
    public string? Notes { get; set; }

    public bool IsActive { get; set; } = true;

    // Foreign keys
    [Required]
    public int RoomTypeId { get; set; }

    // Navigation properties
    public virtual RoomType RoomType { get; set; } = null!;
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}

public enum RoomStatus
{
    Available,
    Occupied,
    OutOfOrder,
    Cleaning,
    Maintenance
}