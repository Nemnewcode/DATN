namespace TeaHouse.Api.DTOs
{
    public class ProductUpdateDto
    {
        public string name { get; set; }
        public decimal price { get; set; }
        public int category_id { get; set; }
        public string? description { get; set; }
        public bool is_active { get; set; }
    }
}
