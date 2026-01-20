using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/discounts")]
    [Authorize(Roles = "Admin")]
    public class AdminDiscountsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminDiscountsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // ===============================
        // GET ALL
        // ===============================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var discounts = await _context.Discounts
                .OrderByDescending(d => d.id)
                .Select(d => new
                {
                    d.id,
                    d.code,
                    d.discount_type,
                    d.value,
                    d.start_date,
                    d.end_date,
                    d.is_active
                })
                .ToListAsync();

            return Ok(discounts);
        }

        // ===============================
        // CREATE
        // ===============================
        [HttpPost]
        public async Task<IActionResult> Create(Discount model)
        {
            // chống trùng code
            if (await _context.Discounts.AnyAsync(d => d.code == model.code))
                return BadRequest("Mã giảm giá đã tồn tại");

            model.is_active = true;

            _context.Discounts.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { model.id });
        }

        // ===============================
        // UPDATE
        // ===============================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Discount dto)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null) return NotFound();

            discount.code = dto.code;
            discount.discount_type = dto.discount_type;
            discount.value = dto.value;
            discount.start_date = dto.start_date;
            discount.end_date = dto.end_date;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // ===============================
        // TOGGLE ACTIVE
        // ===============================
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null) return NotFound();

            discount.is_active = !(discount.is_active ?? true);
            await _context.SaveChangesAsync();

            return Ok(discount.is_active);
        }
    }
}
