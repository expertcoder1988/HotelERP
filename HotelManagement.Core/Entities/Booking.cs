using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.Entities;

public class Booking : BaseEntity
{
    [Required]
    [MaxLength(20)]
    public string BookingNumber { get; set; } = string.Empty;

    [Required]
    public DateTime CheckInDate { get; set; }

    [Required]
    public DateTime CheckOutDate { get; set; }

    [Required]
    public int NumberOfGuests { get; set; }

    [Required]
    public decimal TotalAmount { get; set; }

    [Required]
    public decimal PaidAmount { get; set; } = 0;

    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    [MaxLength(1000)]
    public string? SpecialRequests { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Foreign keys
    [Required]
    public int GuestId { get; set; }

    [Required]
    public int RoomId { get; set; }

    public int? UserId { get; set; } // Staff member who created the booking

    // Navigation properties
    public virtual Guest Guest { get; set; } = null!;
    public virtual Room Room { get; set; } = null!;
    public virtual User? User { get; set; }
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    CheckedIn,
    CheckedOut,
    Cancelled,
    NoShow
}