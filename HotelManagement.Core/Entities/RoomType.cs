using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.Entities;

public class RoomType : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public decimal BasePrice { get; set; }

    [Required]
    public int MaxOccupancy { get; set; }

    [Required]
    public int Size { get; set; } // in square meters

    [MaxLength(1000)]
    public string? Amenities { get; set; } // JSON string of amenities

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}