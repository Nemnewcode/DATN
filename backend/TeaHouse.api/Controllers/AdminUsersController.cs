using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.api.Models;
using TeaHouse.api.DTOs.Users;
using TeaHouse.Api.Data;
using TeaHouse.Api.DTOs;
using TeaHouse.api.DTOs;

namespace TeaHouse.api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminUsersController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // ===============================
        // GET: api/admin/users
        // ===============================
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new AdminUserDto
                {
                    id = u.id,
                    name = u.name,
                    email = u.email,
                    role = u.role,
                    is_active = u.is_active ?? false,
                    phone = u.phone,
                    address = u.address
                })
                .ToListAsync();

            return Ok(users);
        }


        // ===============================
        // POST: api/admin/users
        // ===============================
        [HttpPost]
        public async Task<IActionResult> Create(UserCreateDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.email == dto.email))
                return BadRequest("Email đã tồn tại");

            var user = new User
            {
                name = dto.name,
                email = dto.email,
                password = BCrypt.Net.BCrypt.HashPassword(dto.password),
                role = dto.role,
                is_active = dto.is_active,
                created_at = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Tạo tài khoản thành công");
        }

        // ===============================
        // PUT: api/admin/users/{id}
        // ===============================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AdminUserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.name = dto.name;
            user.email = dto.email;
            user.role = dto.role;
            user.is_active = dto.is_active;
            user.phone = dto.phone;         // ✅
            user.address = dto.address;

            if (!string.IsNullOrWhiteSpace(dto.password))
            {
                user.password = BCrypt.Net.BCrypt.HashPassword(dto.password);
            }

            await _context.SaveChangesAsync();
            return Ok("Cập nhật thành công");
        }

        // ===============================
        // PUT: api/admin/users/{id}/toggle
        // ===============================
        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.is_active = !(user.is_active ?? true);
            await _context.SaveChangesAsync();

            return Ok(new { user.is_active });
        }
    }
}
