using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.DTOs;

public class CreatePaymentDto
{
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public PaymentMethod Method { get; set; }

    [Required]
    public int BookingId { get; set; }

    [MaxLength(100)]
    public string? TransactionId { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdatePaymentDto
{
    public PaymentStatus? Status { get; set; }
    public string? TransactionId { get; set; }
    public string? Notes { get; set; }
}

public class PaymentDto
{
    public int Id { get; set; }
    public string PaymentNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; }
    public string? TransactionId { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int BookingId { get; set; }
    public UserDto? User { get; set; }
}