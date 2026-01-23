using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.Api.DTOs.Inventory;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/admin/inventory")]
    [Authorize(Roles = "Admin")]
    public class AdminInventoryController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminInventoryController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // ===============================
        // GET: api/admin/inventory?type=Ingredient
        // ===============================
        
        [HttpGet]
        public async Task<IActionResult> GetInventory()
        {
            var data = await _context.Inventories
                .Include(i => i.topping)
                .OrderBy(i => i.topping.name)
                .Select(i => new
                {
                    i.id,
                    topping_id = i.topping_id,
                    topping_name = i.topping.name,
                    quantity = i.quantity,
                    is_active = i.is_active,
                    last_update = i.last_update
                })
                .ToListAsync();

            return Ok(data);
        }


        // ===============================
        // PUT: api/admin/inventory/{id}
        // Cập nhật tồn kho trực tiếp
        // ===============================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, UpdateInventoryDto dto)
        {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null) return NotFound();

            inventory.quantity = dto.quantity;
            inventory.last_update = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật tồn kho thành công" });
        }

        // ===============================
        // POST: api/admin/inventory/{id}/import
        // Nhập kho (tăng số lượng)
        // ===============================
        [HttpPost("{id}/import")]
        public async Task<IActionResult> Import(int id, ImportInventoryDto dto)
        {
            if (dto.amount <= 0)
                return BadRequest("Số lượng nhập phải > 0");

            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null) return NotFound();

            inventory.quantity += dto.amount;
            inventory.last_update = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Nhập kho thành công" });
        }

        // ===============================
        // PUT: api/admin/inventory/{id}/toggle
        // ===============================
        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null) return NotFound();

            inventory.is_active = !inventory.is_active;
            inventory.last_update = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
