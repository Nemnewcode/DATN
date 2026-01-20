using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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

        // ===============================
        // GET: api/admin/orders
        // ===============================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.user)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.product)
                .OrderByDescending(o => o.created_at)
                .Select(o => new
                {
                    o.id,
                    o.total,
                    o.status,
                    o.created_at,
                    user = new
                    {
                        o.user.id,
                        o.user.name,
                        o.user.email
                    },
                    items = o.OrderItems.Select(oi => new
                    {
                        product_name = oi.product.name,
                        oi.quantity,
                        oi.price,
                        toppings = oi.OrderToppings.Select(t => new {
                            t.topping.name,
                            t.topping.price
                        })
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // ===============================
        // GET TIMELINE
        // ===============================
        [HttpGet("{id}/timeline")]
        public async Task<IActionResult> GetTimeline(int id)
        {
            var timeline = await _context.OrderStatusHistories
                .Where(h => h.order_id == id)
                .OrderBy(h => h.updated_at)
                .Select(h => new
                {
                    h.status,
                    h.updated_at,
                    updated_by = h.updated_byNavigation.name
                })
                .ToListAsync();

            return Ok(timeline);
        }

        // ===============================
        // CONFIRM ORDER
        // ===============================
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> Confirm(int id)
        {
            return await UpdateStatus(id, OrderStatus.Confirmed);
        }

        // ===============================
        // CANCEL ORDER
        // ===============================
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            return await UpdateStatus(id, OrderStatus.Cancelled);
        }

        // ===============================
        // COMPLETE ORDER
        // ===============================
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> Complete(int id)
        {
            return await UpdateStatus(id, OrderStatus.Completed);
        }

        // ===============================
        // CORE: UPDATE STATUS + HISTORY
        // ===============================
        private async Task<IActionResult> UpdateStatus(int orderId, string newStatus)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.id == orderId);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng");

            if (order.status == OrderStatus.Completed ||
                order.status == OrderStatus.Cancelled)
            {
                return BadRequest("Không thể thay đổi trạng thái đơn hàng này");
            }

            order.status = newStatus;

            var adminIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(adminIdClaim))
                return Unauthorized();

            int adminId = int.Parse(adminIdClaim);

            _context.OrderStatusHistories.Add(new OrderStatusHistory
            {
                order_id = order.id,
                status = newStatus,
                updated_by = adminId,
                updated_at = DateTime.Now
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật trạng thái đơn hàng thành công",
                order_id = order.id,
                status = newStatus
            });
        }
    }

    // ===============================
    // ORDER STATUS CONSTANT
    // ===============================
    public static class OrderStatus
    {
        public const string Pending = "Pending";
        public const string Confirmed = "Confirmed";
        public const string Cancelled = "Cancelled";
        public const string Completed = "Completed";
    }
}
