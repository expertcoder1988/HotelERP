using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.Entities;

public class ServiceBooking : BaseEntity
{
    [Required]
    public int Quantity { get; set; } = 1;

    [Required]
    public decimal UnitPrice { get; set; }

    [Required]
    public decimal TotalPrice { get; set; }

    public DateTime? ServiceDate { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    public ServiceBookingStatus Status { get; set; } = ServiceBookingStatus.Pending;

    // Foreign keys
    [Required]
    public int BookingId { get; set; }

    [Required]
    public int ServiceId { get; set; }

    // Navigation properties
    public virtual Booking Booking { get; set; } = null!;
    public virtual Service Service { get; set; } = null!;
}

public enum ServiceBookingStatus
{
    Pending,
    Confirmed,
    InProgress,
    Completed,
    Cancelled
}