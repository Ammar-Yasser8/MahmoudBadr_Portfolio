using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models
{
    public class Hero
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brief { get; set; } = string.Empty;
        public string CtaText { get; set; } = string.Empty;
        public string CtaLink { get; set; } = string.Empty;
        public string BackgroundVideoUrl { get; set; } = string.Empty;
    }
}
