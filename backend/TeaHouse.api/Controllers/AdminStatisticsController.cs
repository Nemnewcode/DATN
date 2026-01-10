using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/admin/statistics")]
    [Authorize(Roles = "Admin")]
    public class AdminStatisticsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminStatisticsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/statistics
        [HttpGet]
        public async Task<IActionResult> Overview()
        {
            var today = DateTime.Today;
            var monthStart = new DateTime(today.Year, today.Month, 1);

            var completedOrders = _context.Orders
                .Where(o => o.status == "Completed");

            var totalRevenue = await completedOrders
                .SumAsync(o => (decimal?)o.total) ?? 0;

            var todayRevenue = await completedOrders
                .Where(o => o.created_at >= today)
                .SumAsync(o => (decimal?)o.total) ?? 0;

            var monthRevenue = await completedOrders
                .Where(o => o.created_at >= monthStart)
                .SumAsync(o => (decimal?)o.total) ?? 0;

            var totalOrders = await completedOrders.CountAsync();

            return Ok(new
            {
                totalRevenue,
                todayRevenue,
                monthRevenue,
                totalOrders
            });
        }

        // GET: api/admin/statistics/revenue-by-day?days=7
        [HttpGet("revenue-by-day")]
        public async Task<IActionResult> RevenueByDay(int days = 7)
        {
            var fromDate = DateTime.Today.AddDays(-days + 1);

            var data = await _context.Orders
                .Where(o => o.status == "Completed"
                         && o.created_at >= fromDate)
                .GroupBy(o => o.created_at!.Value.Date).Select(g => new
                {
                    date = g.Key,
                    revenue = g.Sum(x => x.total)
                })
                .OrderBy(x => x.date)
                .ToListAsync();

            return Ok(data);
        }

        // GET: api/admin/statistics/top-products?top=5
        [HttpGet("top-products")]
        public async Task<IActionResult> TopProducts(int top = 5)
        {
            var data = await _context.OrderItems
                .Where(oi => oi.order.status == "Completed")
                .GroupBy(oi => new
                {
                    oi.product_id,
                    oi.product.name
                })
                .Select(g => new
                {
                    productId = g.Key.product_id,
                    productName = g.Key.name,
                    quantity = g.Sum(x => x.quantity),
                    revenue = g.Sum(x => x.quantity * x.price)
                })
                .OrderByDescending(x => x.quantity)
                .Take(top)
                .ToListAsync();

            return Ok(data);
        }
    }
}
