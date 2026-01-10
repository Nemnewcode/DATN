using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/toppings")]
    public class ToppingsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public ToppingsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // GET: api/toppings
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Toppings
                .Where(c => c.is_active == true)
                .ToListAsync();

            return Ok(data);
        }

        // POST: api/toppings
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] api.Models.Topping model)
        {
            _context.Toppings.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }
    }
}
