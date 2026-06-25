using CaffeeMenuWebAPI.Data;
using CaffeeMenuWebAPI.Filters;
using CaffeeMenuWebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace CaffeeMenuWebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class MenuController(CafeMenuDbContext dbContext, IWebHostEnvironment environment) : ControllerBase
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
    [ServiceFilter(typeof(AdminAuthorizeFilter))]
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
    [ServiceFilter(typeof(AdminAuthorizeFilter))]
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
    [ServiceFilter(typeof(AdminAuthorizeFilter))]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(5_000_000)]
    public async Task<ActionResult<MenuItem>> UpdateImage(int id, IFormFile image)
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

        var uploadFolder = GetUploadFolder();
        Directory.CreateDirectory(uploadFolder);

        var extension = Path.GetExtension(image.FileName);
        var fileName = $"menu-{id}-{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadFolder, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await image.CopyToAsync(stream);
        }

        DeleteLocalImage(item.Image);

        item.Image = $"/uploads/{fileName}";
        await dbContext.SaveChangesAsync();

        return Ok(item);
    }

    [HttpDelete("{id:int}")]
    [ServiceFilter(typeof(AdminAuthorizeFilter))]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await dbContext.MenuItems.FindAsync(id);

        if (item is null)
        {
            return NotFound();
        }

        dbContext.MenuItems.Remove(item);
        await dbContext.SaveChangesAsync();
        DeleteLocalImage(item.Image);

        return NoContent();
    }

    private string GetUploadFolder()
    {
        return Path.Combine(environment.ContentRootPath, "wwwroot", "uploads");
    }

    private void DeleteLocalImage(string? image)
    {
        if (string.IsNullOrWhiteSpace(image) || !image.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var fileName = Path.GetFileName(image);
        var filePath = Path.Combine(GetUploadFolder(), fileName);

        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
    }
}
