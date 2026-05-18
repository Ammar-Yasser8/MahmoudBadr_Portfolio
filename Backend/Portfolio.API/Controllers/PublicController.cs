using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Models;

namespace Portfolio.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("portfolio")]
        public async Task<IActionResult> GetPortfolioData()
        {
            var hero = await _context.Heroes.FirstOrDefaultAsync();
            var about = await _context.Abouts.FirstOrDefaultAsync();
            var skills = await _context.Skills.OrderBy(s => s.Order).ToListAsync();
            var services = await _context.Services.ToListAsync();
            var projects = await _context.Projects.ToListAsync();
            var reels = await _context.Reels.ToListAsync();

            return Ok(new
            {
                Hero = hero,
                About = about,
                Skills = skills,
                Services = services,
                Projects = projects,
                Reels = reels
            });
        }

        [HttpPost("contact")]
        public async Task<IActionResult> SubmitContact([FromBody] ContactMessage message)
        {
            message.CreatedAt = DateTime.UtcNow;
            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
    }
}
