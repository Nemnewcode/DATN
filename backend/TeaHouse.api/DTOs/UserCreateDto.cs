namespace TeaHouse.api.DTOs.Users
{
    public class UserCreateDto
    {
        public string name { get; set; } = null!;
        public string email { get; set; } = null!;
        public string password { get; set; } = null!;
        public string role { get; set; } = "User";   
        public bool is_active { get; set; } = true;
    }
}
