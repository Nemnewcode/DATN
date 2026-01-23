public class CreateReviewDto
{
    public int product_id { get; set; }
    public int rating { get; set; } // 1–5
    public string? comment { get; set; }
}
