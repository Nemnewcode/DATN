namespace TeaHouse.api.DTOs
{
    public class AdminUserUpdateDto
    {
        public string name { get; set; } = null!;
        public string email { get; set; } = null!;
        public string? password { get; set; }
        public string role { get; set; } = null!;
        public bool is_active { get; set; }
        public string? phone { get; set; }     // ✅
        public string? address { get; set; }   // ✅
    }

}
