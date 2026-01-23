public class AdminReviewDto
{
    public int id { get; set; }
    public string product_name { get; set; } = null!;
    public string user_name { get; set; } = null!;
    public int rating { get; set; }
    public string? comment { get; set; }
    public bool is_approved { get; set; }
    public DateTime created_at { get; set; }
}
