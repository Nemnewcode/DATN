using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TeaHouse.Api.Data;
using TeaHouse.Api.DTOs;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public OrdersController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // POST: api/orders
        // USER ĐẶT HÀNG (KHÔNG KIỂM TRA TỒN KHO)
        // =====================================================
        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            int userId = int.Parse(userIdStr);

            var order = new Order
            {
                user_id = userId,
                status = "Pending",
                created_at = DateTime.Now,
                discount_id = dto.discount_id,
                total = 0
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            decimal total = 0;

            // ===============================
            // 1️⃣ ORDER ITEMS
            // ===============================
            foreach (var item in dto.items)
            {
                var product = await _context.Products.FindAsync(item.product_id);

                if (product == null || product.is_active != true)
                {
                    return BadRequest("Sản phẩm không khả dụng");
                }

                var orderItem = new OrderItem
                {
                    order_id = order.id,
                    product_id = product.id,
                    quantity = item.quantity,
                    price = product.price // snapshot
                };

                _context.OrderItems.Add(orderItem);
                await _context.SaveChangesAsync();

                total += product.price * item.quantity;

                // ===== TOPPINGS =====
                if (item.topping_ids != null && item.topping_ids.Any())
                {
                    foreach (var toppingId in item.topping_ids)
                    {
                        var topping = await _context.Toppings.FindAsync(toppingId);
                        if (topping == null || topping.is_active != true) continue;

                        _context.OrderToppings.Add(new OrderTopping
                        {
                            order_item_id = orderItem.id,
                            topping_id = toppingId
                        });

                        total += topping.price;
                    }
                }
            }

            // ===============================
            // 2️⃣ APPLY DISCOUNT (NẾU CÓ)
            // ===============================
            decimal discountAmount = 0;

            if (dto.discount_id.HasValue)
            {
                var discount = await _context.Discounts.FirstOrDefaultAsync(d =>
                    d.id == dto.discount_id &&
                    d.is_active == true &&
                    (d.start_date == null || d.start_date <= DateTime.Now) &&
                    (d.end_date == null || d.end_date >= DateTime.Now)
                );

                if (discount != null)
                {
                    if (discount.discount_type == "percent")
                    {
                        discountAmount = total * (discount.value / 100);
                    }
                    else if (discount.discount_type == "fixed")
                    {
                        discountAmount = discount.value;
                    }
                }
            }

            total -= discountAmount;
            if (total < 0) total = 0;

            // ===============================
            // 3️⃣ FINALIZE ORDER
            // ===============================
            order.total = total;

            _context.OrderStatusHistories.Add(new OrderStatusHistory
            {
                order_id = order.id,
                status = "Pending",
                updated_by = userId,
                updated_at = DateTime.Now
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                orderId = order.id,
                total
            });
        }

        // =====================================================
        // GET: api/orders/my
        // ĐƠN HÀNG CỦA USER
        // =====================================================
        [HttpGet("my")]
        public async Task<IActionResult> MyOrders()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            int userId = int.Parse(userIdStr);

            var orders = await _context.Orders
                .Where(o => o.user_id == userId)
                .OrderByDescending(o => o.created_at)
                .Select(o => new
                {
                    o.id,
                    o.total,
                    o.status,
                    o.created_at,
                    discount = o.discount != null ? o.discount.code : null,
                    items = o.OrderItems.Select(oi => new
                    {
                        oi.product.name,
                        oi.quantity,
                        oi.price,
                        toppings = oi.OrderToppings.Select(ot => new
                        {
                            ot.topping.name,
                            ot.topping.price
                        })
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // =====================================================
        // CHECK DISCOUNT (FRONTEND APPLY)
        // =====================================================
        [HttpGet("check-discount/{code}")]
        public async Task<IActionResult> CheckDiscount(string code)
        {
            var discount = await _context.Discounts
                .Where(d =>
                    d.code == code &&
                    d.is_active == true &&
                    (d.start_date == null || d.start_date <= DateTime.Now) &&
                    (d.end_date == null || d.end_date >= DateTime.Now)
                )
                .Select(d => new
                {
                    d.id,
                    d.code,
                    d.discount_type,
                    d.value
                })
                .FirstOrDefaultAsync();

            if (discount == null)
                return BadRequest("Mã giảm giá không hợp lệ");

            return Ok(discount);
        }
        [HttpGet("{orderId}/timeline")]
        public async Task<IActionResult> GetOrderTimeline(int orderId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            int userId = int.Parse(userIdStr);

            // chỉ cho user xem đơn của chính mình
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.id == orderId && o.user_id == userId);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng");

            var timeline = await _context.OrderStatusHistories
                .Where(h => h.order_id == orderId)
                .OrderBy(h => h.updated_at)
                .Select(h => new
                {
                    h.status,
                    h.updated_at
                })
                .ToListAsync();

            return Ok(timeline);
        }
        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            int userId = int.Parse(userIdStr);

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.id == id && o.user_id == userId);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng");

            if (order.status != "Pending")
                return BadRequest("Chỉ được hủy đơn khi đang chờ xác nhận");

            // cập nhật trạng thái
            order.status = "Cancelled";

            // lưu lịch sử
            _context.OrderStatusHistories.Add(new OrderStatusHistory
            {
                order_id = order.id,
                status = "Cancelled",
                updated_by = userId,
                updated_at = DateTime.Now
            });

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã hủy đơn hàng" });
        }
    }
}
