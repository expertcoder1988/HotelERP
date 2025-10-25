using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.Entities;

public class User : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(500)]
    public string? Address { get; set; }

    public UserRole Role { get; set; } = UserRole.Staff;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

public enum UserRole
{
    Admin,
    Manager,
    Receptionist,
    Staff,
    Guest
}