using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Models;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace Portfolio.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request.Username == "admin" && request.Password == "admin123")
            {
                return Ok(new { success = true });
            }
            return Unauthorized();
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromBody] FileUploadRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Base64Data) || string.IsNullOrEmpty(request.FileName))
                {
                    return BadRequest("No file data provided.");
                }

                // Save to a fixed path COMPLETELY outside the solution tree
                // so Visual Studio's file watcher never detects new files
                var uploadsFolder = @"C:\PortfolioUploads";

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Decode base64 and save
                var fileBytes = Convert.FromBase64String(request.Base64Data);
                await System.IO.File.WriteAllBytesAsync(filePath, fileBytes);

                var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Upload] ERROR: {ex.Message}");
                return StatusCode(500, $"Upload error: {ex.Message}");
            }
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            return Ok(new
            {
                TotalProjects = await _context.Projects.CountAsync(),
                Messages = await _context.ContactMessages.CountAsync(),
                FeaturedVideos = await _context.Reels.Where(r => r.IsFeatured).CountAsync(),
                Services = await _context.Services.CountAsync()
            });
        }

        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages() => Ok(await _context.ContactMessages.OrderByDescending(m => m.CreatedAt).ToListAsync());

        // We can add simple CRUD for everything if needed, but for now we'll do basic ones.
        // --- HERO ---
        [HttpPut("hero")]
        public async Task<IActionResult> UpdateHero([FromBody] Hero hero)
        {
            var existing = await _context.Heroes.FirstOrDefaultAsync();
            if (existing == null) {
                _context.Heroes.Add(hero);
            } else {
                existing.Name = hero.Name;
                existing.Brief = hero.Brief;
                existing.CtaText = hero.CtaText;
                existing.CtaLink = hero.CtaLink;
                existing.BackgroundVideoUrl = hero.BackgroundVideoUrl;
            }
            await _context.SaveChangesAsync();
            return Ok(hero);
        }

        // --- ABOUT ---
        [HttpPut("about")]
        public async Task<IActionResult> UpdateAbout([FromBody] About about)
        {
            var existing = await _context.Abouts.FirstOrDefaultAsync();
            if (existing == null) {
                _context.Abouts.Add(about);
            } else {
                existing.Title = about.Title;
                existing.Brief = about.Brief;
                existing.ImageUrl = about.ImageUrl;
            }
            await _context.SaveChangesAsync();
            return Ok(about);
        }

        // --- SKILLS ---
        [HttpPost("skills")]
        public async Task<IActionResult> AddSkill([FromBody] Skill skill) { _context.Skills.Add(skill); await _context.SaveChangesAsync(); return Ok(skill); }
        [HttpDelete("skills/{id}")]
        public async Task<IActionResult> DeleteSkill(int id) { var s = await _context.Skills.FindAsync(id); if (s != null) { _context.Skills.Remove(s); await _context.SaveChangesAsync(); } return Ok(); }

        // --- SERVICES ---
        [HttpPost("services")]
        public async Task<IActionResult> AddService([FromBody] Service service) { _context.Services.Add(service); await _context.SaveChangesAsync(); return Ok(service); }
        [HttpDelete("services/{id}")]
        public async Task<IActionResult> DeleteService(int id) { var s = await _context.Services.FindAsync(id); if (s != null) { _context.Services.Remove(s); await _context.SaveChangesAsync(); } return Ok(); }

        // --- PROJECTS ---
        [HttpPost("projects")]
        public async Task<IActionResult> AddProject([FromBody] Project project) { _context.Projects.Add(project); await _context.SaveChangesAsync(); return Ok(project); }
        [HttpDelete("projects/{id}")]
        public async Task<IActionResult> DeleteProject(int id) { var p = await _context.Projects.FindAsync(id); if (p != null) { _context.Projects.Remove(p); await _context.SaveChangesAsync(); } return Ok(); }

        // --- REELS ---
        [HttpPost("reels")]
        public async Task<IActionResult> AddReel([FromBody] Reel reel)
        { 
            _context.Reels.Add(reel); 
            await _context.SaveChangesAsync(); return Ok(reel); 
        }
        [HttpDelete("reels/{id}")]
        public async Task<IActionResult> DeleteReel(int id) { var r = await _context.Reels.FindAsync(id); if (r != null) { _context.Reels.Remove(r); await _context.SaveChangesAsync(); } return Ok(); }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class FileUploadRequest
    {
        public string FileName { get; set; } = string.Empty;
        public string Base64Data { get; set; } = string.Empty;
    }
}
