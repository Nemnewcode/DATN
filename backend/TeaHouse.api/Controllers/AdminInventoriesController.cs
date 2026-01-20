using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/inventories")]
    [Authorize(Roles = "Admin")]
    public class AdminInventoriesController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminInventoriesController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // ===============================
        // GET: api/admin/inventories
        // ===============================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Products
                .Include(p => p.Inventories)
                .Select(p => new
                {
                    product_id = p.id,
                    product_name = p.name,
                    price = p.price,
                    status = p.status,
                    quantity = p.Inventories
                        .Where(i => i.is_active == true)
                        .Select(i => i.quantity)
                        .FirstOrDefault(),
                    is_tracking = p.Inventories.Any(i => i.is_active == true)
                })
                .ToListAsync();

            return Ok(data);
        }

        // ===============================
        // PUT: api/admin/inventories/{productId}
        // ===============================
        [HttpPut("{productId}")]
        public async Task<IActionResult> Update(int productId, [FromBody] int quantity)
        {
            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i => i.product_id == productId);

            if (inventory == null)
            {
                inventory = new Inventory
                {
                    product_id = productId,
                    quantity = quantity,
                    is_active = true,
                    last_update = DateTime.Now
                };
                _context.Inventories.Add(inventory);
            }
            else
            {
                inventory.quantity = quantity;
                inventory.last_update = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật tồn kho thành công" });
        }

        // ===============================
        // PATCH: toggle tracking
        // ===============================
        [HttpPatch("{productId}/toggle")]
        public async Task<IActionResult> Toggle(int productId)
        {
            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i => i.product_id == productId);

            if (inventory == null)
                return NotFound();

            inventory.is_active = !inventory.is_active;
            inventory.last_update = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(inventory.is_active);
        }
    }
}
