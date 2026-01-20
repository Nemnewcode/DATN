using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/orders/{orderId}/history")]
    public class OrderStatusHistoryController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public OrderStatusHistoryController(TeaHouseDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHistory(int orderId)
        {
            var history = await _context.OrderStatusHistories
                .Where(h => h.order_id == orderId)
                .OrderBy(h => h.updated_at)
                .Select(h => new
                {
                    h.status,
                    h.updated_at,
                    updated_by = h.updated_byNavigation.name
                })
                .ToListAsync();

            return Ok(history);
        }
    }
}
