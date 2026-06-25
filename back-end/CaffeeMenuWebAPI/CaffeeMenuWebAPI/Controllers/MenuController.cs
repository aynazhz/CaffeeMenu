using CaffeeMenuWebAPI.Data;
using CaffeeMenuWebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace CaffeeMenuWebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class MenuController(CafeMenuDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuItem>>> Get([FromQuery] string? category = null)
    {
        var query = dbContext.MenuItems.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            var normalizedCategory = category.Trim().ToLower();
            query = query.Where(item => item.Category.ToLower() == normalizedCategory);
        }

        var items = await query.OrderBy(item => item.Id).ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MenuItem>> GetById(int id)
    {
        var item = await dbContext.MenuItems.AsNoTracking().FirstOrDefaultAsync(menuItem => menuItem.Id == id);

        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        var categories = await dbContext.MenuItems
            .AsNoTracking()
            .Select(item => item.Category)
            .Distinct()
            .OrderBy(category => category)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<MenuItem>> Create(CreateMenuItemRequest request)
    {
        var item = new MenuItem
        {
            Title = request.Title.Trim(),
            Price = request.Price.Trim(),
            Category = request.Category.Trim().ToLower(),
            Image = request.Image.Trim()
        };

        dbContext.MenuItems.Add(item);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateMenuItemRequest request)
    {
        var item = await dbContext.MenuItems.FindAsync(id);

        if (item is null)
        {
            return NotFound();
        }

        item.Title = request.Title.Trim();
        item.Price = request.Price.Trim();
        item.Category = request.Category.Trim().ToLower();
        item.Image = request.Image.Trim();

        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:int}/image")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(5_000_000)]
    public async Task<ActionResult<MenuItem>> UpdateImage(
        int id,
        IFormFile image,
        [FromServices] IWebHostEnvironment environment)
    {
        if (image.Length == 0)
        {
            return BadRequest("Image file is required.");
        }

        if (!image.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Only image files are allowed.");
        }

        var item = await dbContext.MenuItems.FindAsync(id);

        if (item is null)
        {
            return NotFound();
        }

        var webRoot = environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot");
        var uploadFolder = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadFolder);

        var extension = Path.GetExtension(image.FileName);
        var fileName = $"menu-{id}-{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadFolder, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await image.CopyToAsync(stream);
        }

        item.Image = $"/uploads/{fileName}";
        await dbContext.SaveChangesAsync();

        return Ok(item);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await dbContext.MenuItems.FindAsync(id);

        if (item is null)
        {
            return NotFound();
        }

        dbContext.MenuItems.Remove(item);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }
}
