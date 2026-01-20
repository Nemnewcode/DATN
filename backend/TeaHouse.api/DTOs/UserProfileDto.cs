namespace TeaHouse.Api.DTOs.Users
{
    public class UserProfileDto
    {
        public int id { get; set; }
        public string username { get; set; } = null!;
        public string name { get; set; } = null!;
        public string email { get; set; } = null!;
        public string? phone { get; set; }
        public string? address { get; set; }
        public string role { get; set; } = null!;
        public DateTime? created_at { get; set; }
    }
}
