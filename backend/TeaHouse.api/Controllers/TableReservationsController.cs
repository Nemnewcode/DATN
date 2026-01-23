using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TeaHouse.Api.Data;
using TeaHouse.Api.DTOs;
using TeaHouse.api.Models;
using Microsoft.EntityFrameworkCore;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/table-reservations")]
    public class TableReservationsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public TableReservationsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // POST: api/table-reservations
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TableReservationDto dto)
        {
            int? userId = null;

            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            }

            var reservation = new TableReservation
{
    user_id = userId,
    customer_name = dto.customer_name,
    phone = dto.phone,
    email = dto.email,
    reservation_date = DateOnly.FromDateTime(dto.reservation_date),
    reservation_time = TimeOnly.Parse(dto.reservation_time),
    number_of_people = dto.number_of_people,
    note = dto.note,
    status = "Pending",
    created_at = DateTime.Now
};


            _context.TableReservations.Add(reservation);
            await _context.SaveChangesAsync();

            // ✅ 
            return Ok(new
            {
                message = "Đặt bàn thành công",
                reservation_id = reservation.id,
                status = reservation.status
            });
        }
        // GET: api/table-reservations/admin
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var data = await _context.TableReservations
                .OrderByDescending(r => r.created_at)
                .Select(r => new
                {
                    r.id,
                    r.customer_name,
                    r.phone,
                    r.email,
                    r.reservation_date,
                    r.reservation_time,
                    r.number_of_people,
                    r.status,
                    r.created_at
                })
                .ToListAsync();

            return Ok(data);
        }
        // PUT: api/table-reservations/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var reservation = await _context.TableReservations.FindAsync(id);
            if (reservation == null) return NotFound();

            reservation.status = status;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật trạng thái thành công",
                reservation.id,
                reservation.status
            });
        }
        // GET: api/table-reservations/my
        [HttpGet("my")]
        public async Task<IActionResult> GetMyReservations()
        {
            if (User.Identity == null || !User.Identity.IsAuthenticated)
                return Unauthorized();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var data = await _context.TableReservations
                .Where(r => r.user_id == userId)
                .OrderByDescending(r => r.created_at)
                .Select(r => new
                {
                    r.id,
                    r.customer_name,
                    r.phone,
                    r.email,
                    r.reservation_date,
                    r.reservation_time,
                    r.number_of_people,
                    r.status,
                    r.note,
                    r.created_at
                })
                .ToListAsync();

            return Ok(data);
        }
        // PUT: api/table-reservations/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelReservation(int id)
        {
            if (User.Identity == null || !User.Identity.IsAuthenticated)
                return Unauthorized();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var reservation = await _context.TableReservations
                .FirstOrDefaultAsync(r => r.id == id && r.user_id == userId);

            if (reservation == null)
                return NotFound(new { message = "Không tìm thấy đặt bàn" });

            if (reservation.status != "Pending")
                return BadRequest(new { message = "Không thể hủy đặt bàn đã được xử lý" });

            reservation.status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Hủy đặt bàn thành công",
                reservation.id,
                reservation.status
            });
        }



    }
}
