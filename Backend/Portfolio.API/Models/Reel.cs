using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models
{
    public class Reel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string YoutubeLink { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
    }
}
