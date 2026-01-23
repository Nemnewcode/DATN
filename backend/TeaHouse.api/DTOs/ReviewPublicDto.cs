public class ReviewPublicDto
{
    public int id { get; set; }
    public int rating { get; set; }
    public string? comment { get; set; }
    public string user_name { get; set; } = null!;
    public DateTime created_at { get; set; }
}
