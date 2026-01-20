namespace TeaHouse.api.DTOs.Users
{
    public class UserUpdateDto
    {
        public string name { get; set; } = null!;
        public string email { get; set; } = null!;
        public string? password { get; set; }
        public string role { get; set; } = null!;    
        public bool is_active { get; set; }
    }
}
