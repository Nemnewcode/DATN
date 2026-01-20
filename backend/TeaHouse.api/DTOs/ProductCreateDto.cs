namespace TeaHouse.Api.DTOs
{
    public class ProductCreateDto
    {
        public string name { get; set; }
        public decimal price { get; set; }
        public int category_id { get; set; }
        public string? description { get; set; }

        // 🔥 danh sách URL ảnh
        public List<string>? images { get; set; }
    }
}
