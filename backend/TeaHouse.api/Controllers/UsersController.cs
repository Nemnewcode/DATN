using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.Api.DTOs.Users;

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

        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users
                .Where(u => u.id == userId)
                .Select(u => new UserProfileDto
                {
                    id = u.id,
                    username = u.username,
                    name = u.name,
                    email = u.email,
                    phone = u.phone,
                    address = u.address,
                    role = u.role,
                    created_at = u.created_at
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UserUpdateProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            user.name = dto.name;
            user.phone = dto.phone;
            user.address = dto.address;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin thành công" });
        }
    }
}
