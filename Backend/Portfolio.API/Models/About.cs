using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models
{
    public class About
    {
       
        public int Id { get; set; }
        
        public string Title { get; set; } = string.Empty;
        public string Brief { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }
}
