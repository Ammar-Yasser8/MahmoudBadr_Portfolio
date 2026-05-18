using Microsoft.EntityFrameworkCore;
using Portfolio.API.Models;

namespace Portfolio.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Hero> Heroes { get; set; }
        public DbSet<About> Abouts { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Reel> Reels { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed initial data for Hero
            modelBuilder.Entity<Hero>().HasData(
                new Hero 
                { 
                    Id = 1, 
                    Name = "Mahmoud Badr", 
                    Brief = "Professional Video Editor & Motion Graphic Designer",
                    CtaText = "View My Work",
                    CtaLink = "#projects",
                    BackgroundVideoUrl = "/assets/hero-reel.mp4"
                }
            );

            // Seed initial data for About
            modelBuilder.Entity<About>().HasData(
                new About 
                { 
                    Id = 1, 
                    Title = "About Me", 
                    Brief = "I am a passionate video editor and motion graphic designer with years of experience creating compelling visual stories.",
                    ImageUrl = ""
                }
            );
        }
    }
}
