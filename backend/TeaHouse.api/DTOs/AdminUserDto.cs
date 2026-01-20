namespace TeaHouse.Api.DTOs
{
    public class AdminUserDto
    {
        public int id { get; set; }
        public string name { get; set; } = null!;
        public string email { get; set; } = null!;
        public string role { get; set; } = null!;
        public bool is_active { get; set; }
        public DateTime? created_at { get; set; }
        public string? phone { get; set; }      
        public string? address { get; set; }
    }
}
