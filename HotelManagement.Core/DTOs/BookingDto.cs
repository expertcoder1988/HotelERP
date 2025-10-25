using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.DTOs;

public class CreateBookingDto
{
    [Required]
    public int GuestId { get; set; }

    [Required]
    public int RoomId { get; set; }

    [Required]
    public DateTime CheckInDate { get; set; }

    [Required]
    public DateTime CheckOutDate { get; set; }

    [Required]
    [Range(1, 10)]
    public int NumberOfGuests { get; set; }

    [MaxLength(1000)]
    public string? SpecialRequests { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateBookingDto
{
    public DateTime? CheckInDate { get; set; }
    public DateTime? CheckOutDate { get; set; }
    public int? NumberOfGuests { get; set; }
    public BookingStatus? Status { get; set; }
    public string? SpecialRequests { get; set; }
    public string? Notes { get; set; }
}

public class BookingDto
{
    public int Id { get; set; }
    public string BookingNumber { get; set; } = string.Empty;
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int NumberOfGuests { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public BookingStatus Status { get; set; }
    public string? SpecialRequests { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Related entities
    public GuestDto Guest { get; set; } = null!;
    public RoomDto Room { get; set; } = null!;
    public UserDto? User { get; set; }
    public List<PaymentDto> Payments { get; set; } = new();
}

public class BookingListDto
{
    public int Id { get; set; }
    public string BookingNumber { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string RoomNumber { get; set; } = string.Empty;
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public decimal TotalAmount { get; set; }
    public BookingStatus Status { get; set; }
}