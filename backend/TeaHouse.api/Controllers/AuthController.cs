using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using TeaHouse.api.Models;
using TeaHouse.Api.DTOs;
using TeaHouse.Api.Data;
using BCrypt;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(TeaHouseDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // ===============================
        // POST: api/auth/register
        // ===============================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var exists = await _context.Users
                .AnyAsync(u => u.email == dto.email);

            if (exists)
                return BadRequest("Email đã tồn tại");

            var user = new User
            {
                name = dto.name,
                email = dto.email,
                password = BCrypt.Net.BCrypt.HashPassword(dto.password), // ✅ HASH
                role = "User",
                is_active = true,
                created_at = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Đăng ký thành công");
        }

        // ===============================
        // POST: api/auth/login
        // ===============================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.email == dto.email);

            if (user == null)
                return Unauthorized("Sai email hoặc mật khẩu");

            // ❌ USER BỊ KHOÁ
            if (user.is_active == false)
                return Unauthorized("Tài khoản đã bị khoá");

            // ❌ SAI MẬT KHẨU
            if (!BCrypt.Net.BCrypt.Verify(dto.password, user.password))
                return Unauthorized("Sai email hoặc mật khẩu");

            // ================= JWT =================
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.Role, user.role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(
                    int.Parse(_config["Jwt:ExpireMinutes"]!)),
                signingCredentials: new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = new
                {
                    id = user.id,
                    name = user.name,
                    email = user.email,
                    role = user.role
                }
            });
        }

        // ===============================
        // POST: api/auth/logout
        // ===============================
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // JWT stateless → logout xử lý frontend
            return Ok(new { message = "Đăng xuất thành công" });
        }
    }
}
