using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TeaHouse.api.Models;
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

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var order = new Order
            {
                user_id = userId,
                status = "Pending",
                created_at = DateTime.Now,
                discount_id = dto.discount_id
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            decimal total = 0;

            foreach (var item in dto.items)
            {
                var product = await _context.Products.FindAsync(item.product_id);
                if (product == null) continue;

                var orderItem = new OrderItem
                {
                    order_id = order.id,
                    product_id = product.id,
                    quantity = item.quantity,
                    price = product.price
                };

                _context.OrderItems.Add(orderItem);
                await _context.SaveChangesAsync();

                total += product.price * item.quantity;

                if (item.topping_ids != null)
                {
                    foreach (var toppingId in item.topping_ids)
                    {
                        var topping = await _context.Toppings.FindAsync(toppingId);
                        if (topping == null) continue;

                        _context.OrderToppings.Add(new OrderTopping
                        {
                            order_item_id = orderItem.id,
                            topping_id = toppingId
                        });

                        total += topping.price;
                    }
                }
            }

            order.total = total;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                orderId = order.id,
                total
            });
        }

        // GET: api/orders/my
        [HttpGet("my")]
        public async Task<IActionResult> MyOrders()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var orders = await _context.Orders
                .Where(o => o.user_id == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.OrderToppings)
                        .ThenInclude(ot => ot.topping)
                .ToListAsync();

            return Ok(orders);
        }
    }
}
