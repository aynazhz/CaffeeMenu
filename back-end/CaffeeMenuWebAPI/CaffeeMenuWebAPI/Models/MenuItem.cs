namespace CaffeeMenuWebAPI.Models;

public sealed class MenuItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Price { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Image { get; set; } = string.Empty;
}
