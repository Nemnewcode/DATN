using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.api.Models;
using TeaHouse.Api.Data;

namespace TeaHouse.api.Controllers
{
    [ApiController]
    [Route("api/admin/statistics")]
    public class AdminStatisticsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context; 

        public AdminStatisticsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardStatistics()
        {
            try
            {
                var totalRevenue = await _context.Orders
                    .Where(o => o.status == "Completed")
                    .Select(o => (decimal?)o.total)
                    .SumAsync() ?? 0;

                var totalOrders = await _context.Orders.CountAsync();

                var pendingReservations = await _context.Orders
                    .CountAsync(o => o.status == "Pending");

                // ✅ FIX CHỖ NÀY
                var revenueByDayRaw = await _context.Orders
                    .Where(o =>
                        o.status == "Completed" &&
                        o.created_at != null
                    )
                    .GroupBy(o => o.created_at.Value.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        Revenue = g.Sum(x => x.total)
                    })
                    .OrderBy(x => x.Date)
                    .Take(7)
                    .ToListAsync();

                var revenueByDay = revenueByDayRaw
                    .Select(x => new
                    {
                        date = x.Date.ToString("dd/MM"),
                        revenue = x.Revenue
                    });

                var orderStatus = await _context.Orders
                    .Where(o => o.status != null)
                    .GroupBy(o => o.status)
                    .Select(g => new
                    {
                        status = g.Key,
                        count = g.Count()
                    })
                    .ToListAsync();

                var totalProductsSold = await _context.OrderItems
                    .Select(oi => (int?)oi.quantity)
                    .SumAsync() ?? 0;

                return Ok(new
                {
                    totalRevenue,
                    totalOrders,
                    pendingReservations,
                    totalProducts = totalProductsSold,
                    revenueByDay,
                    orderStatus
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Dashboard statistics error",
                    error = ex.Message
                });
            }
        }

    }
}
