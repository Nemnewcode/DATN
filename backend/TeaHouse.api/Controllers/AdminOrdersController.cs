using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TeaHouse.api.Models;
using TeaHouse.Api.Data;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/admin/orders")]
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminOrdersController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/orders
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.user)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.product)
                .OrderByDescending(o => o.created_at)
                .ToListAsync();

            return Ok(orders);
        }

        // PUT: api/admin/orders/{id}/confirm
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> Confirm(int id)
        {
            return await UpdateStatus(id, "Confirmed");
        }

        // PUT: api/admin/orders/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            return await UpdateStatus(id, "Cancelled");
        }

        // PUT: api/admin/orders/{id}/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> Complete(int id)
        {
            return await UpdateStatus(id, "Completed");
        }

        private async Task<IActionResult> UpdateStatus(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return NotFound();

            order.status = status;

            // lưu lịch sử trạng thái
            var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            _context.OrderStatusHistories.Add(new OrderStatusHistory
            {
                order_id = order.id,
                status = status,
                updated_by = adminId,
                updated_at = DateTime.Now
            });

            await _context.SaveChangesAsync();

            return Ok($"Đơn hàng đã chuyển sang trạng thái: {status}");
        }
    }
}
