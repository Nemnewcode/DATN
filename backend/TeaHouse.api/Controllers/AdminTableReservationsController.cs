using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/admin/table-reservations")]
    [Authorize(Roles = "Admin")]
    public class AdminTableReservationsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminTableReservationsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/table-reservations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _context.TableReservations
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
                    r.note,
                    r.status,
                    r.created_at
                })
                .ToListAsync();

            return Ok(reservations);
        }

        // PUT: api/admin/table-reservations/{id}/approve
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var reservation = await _context.TableReservations.FindAsync(id);
            if (reservation == null)
                return NotFound(new { message = "Không tìm thấy đặt bàn" });

            if (reservation.status != "Pending")
                return BadRequest(new { message = "Đặt bàn đã được xử lý trước đó" });

            reservation.status = "Approved";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã duyệt đặt bàn" });
        }

        // PUT: api/admin/table-reservations/{id}/reject
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            var reservation = await _context.TableReservations.FindAsync(id);
            if (reservation == null)
                return NotFound(new { message = "Không tìm thấy đặt bàn" });

            if (reservation.status != "Pending")
                return BadRequest(new { message = "Đặt bàn đã được xử lý trước đó" });

            reservation.status = "Rejected";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã từ chối đặt bàn" });
        }
    }
}
