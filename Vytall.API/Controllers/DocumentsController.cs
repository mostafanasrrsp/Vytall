using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private static readonly string[] AllowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };

    public DocumentsController(IWebHostEnvironment env)
    {
        _env = env;
    }

    // POST: api/documents/upload
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] int patientId)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest("Only PDF and image files are allowed.");

        var documentsPath = Path.Combine(_env.ContentRootPath, "Documents");
        if (!Directory.Exists(documentsPath))
            Directory.CreateDirectory(documentsPath);

        var fileName = $"patient_{patientId}_{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(documentsPath, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
        // In a real app, save file metadata to DB here
        return Ok(new { fileName });
    }

    // GET: api/documents/download/{fileName}
    [HttpGet("download/{fileName}")]
    public IActionResult Download(string fileName)
    {
        var documentsPath = Path.Combine(_env.ContentRootPath, "Documents");
        var filePath = Path.Combine(documentsPath, fileName);
        if (!System.IO.File.Exists(filePath))
            return NotFound();
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var contentType = ext switch
        {
            ".pdf" => "application/pdf",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            _ => "application/octet-stream"
        };
        var bytes = System.IO.File.ReadAllBytes(filePath);
        return File(bytes, contentType, fileName);
    }
} 