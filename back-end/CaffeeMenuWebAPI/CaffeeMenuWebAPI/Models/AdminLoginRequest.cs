using System.ComponentModel.DataAnnotations;

namespace CaffeeMenuWebAPI.Models;

public sealed class AdminLoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
