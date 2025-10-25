using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Core.DTOs;

public class CreateServiceDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    public ServiceCategory Category { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

public class UpdateServiceDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal? Price { get; set; }

    public ServiceCategory? Category { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    public bool? IsActive { get; set; }
}

public class ServiceDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public ServiceCategory Category { get; set; }
    public bool IsActive { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}