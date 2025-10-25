using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.Entities;

public class Payment : BaseEntity
{
    [Required]
    [MaxLength(20)]
    public string PaymentNumber { get; set; } = string.Empty;

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public PaymentMethod Method { get; set; }

    [Required]
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    [MaxLength(100)]
    public string? TransactionId { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime? ProcessedAt { get; set; }

    // Foreign keys
    [Required]
    public int BookingId { get; set; }

    public int? UserId { get; set; } // Staff member who processed the payment

    // Navigation properties
    public virtual Booking Booking { get; set; } = null!;
    public virtual User? User { get; set; }
}

public enum PaymentMethod
{
    Cash,
    CreditCard,
    DebitCard,
    BankTransfer,
    Check,
    Other
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded,
    Cancelled
}