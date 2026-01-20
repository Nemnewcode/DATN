using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/toppings")]
    [Authorize(Roles = "Admin")]
    public class AdminToppingsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminToppingsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // ===============================
        // GET ALL TOPPINGS
        // ===============================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var toppings = await _context.Toppings
                .OrderByDescending(t => t.id)
                .Select(t => new
                {
                    t.id,
                    t.name,
                    t.price,
                    t.is_active,
                   
                })
                .ToListAsync();

            return Ok(toppings);
        }

        // ===============================
        // CREATE TOPPING
        // ===============================
        [HttpPost]
        public async Task<IActionResult> Create(Topping dto)
        {
            var topping = new Topping
            {
                name = dto.name,
                price = dto.price,
                
                is_active = true
            };

            _context.Toppings.Add(topping);
            await _context.SaveChangesAsync();

            return Ok(topping);
        }

        // ===============================
        // UPDATE TOPPING
        // ===============================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Topping dto)
        {
            var topping = await _context.Toppings.FindAsync(id);
            if (topping == null) return NotFound();

            topping.name = dto.name;
            topping.price = dto.price;
            

            await _context.SaveChangesAsync();
            return Ok();
        }

        // ===============================
        // TOGGLE ACTIVE
        // ===============================
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var topping = await _context.Toppings.FindAsync(id);
            if (topping == null) return NotFound();

            topping.is_active = !(topping.is_active ?? true);
            await _context.SaveChangesAsync();

            return Ok(topping.is_active);
        }
    }
}
