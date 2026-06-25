using System.ComponentModel.DataAnnotations;

namespace CaffeeMenuWebAPI.Models;

public sealed class CreateMenuItemRequest
{
    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Price { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;
}
