using Microsoft.AspNetCore.Http;

public class FeaturedNewsUpdateDto
{
    public string title { get; set; } = null!;
    public string slug { get; set; } = null!;
    public string? short_description { get; set; }
    public string recipe_content { get; set; } = null!;
    public IFormFile? thumbnail { get; set; }
    public int drink_id { get; set; }
    public bool is_active { get; set; }
}
