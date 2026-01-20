using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TeaHouse.api.Models;
using TeaHouse.Api.DTOs;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public UsersController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // ===============================
        // GET: api/user/profile
        // ===============================
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users
                .Where(u => u.id == userId)
                .Select(u => new
                {
                    u.id,
                    u.name,
                    u.email,
                    u.role,
                    u.created_at
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // ===============================
        // PUT: api/user/profile
        // ===============================
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UserProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            user.name = dto.name;
            await _context.SaveChangesAsync();

            return Ok("Cập nhật thông tin thành công");
        }
    }
}
