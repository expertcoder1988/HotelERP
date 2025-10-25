using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.Entities;

public class Service : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public decimal Price { get; set; }

    [Required]
    public ServiceCategory Category { get; set; }

    public bool IsActive { get; set; } = true;

    [MaxLength(1000)]
    public string? Notes { get; set; }

    // Navigation properties
    public virtual ICollection<ServiceBooking> ServiceBookings { get; set; } = new List<ServiceBooking>();
}

public enum ServiceCategory
{
    Food,
    Beverage,
    Spa,
    Laundry,
    Transportation,
    Entertainment,
    Other
}