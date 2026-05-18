using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models
{
    public class Skill
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty; // Comma-separated tags
        public int Order { get; set; }
    }
}
