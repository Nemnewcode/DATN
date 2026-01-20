using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.Api.DTOs.Discounts;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/discounts")]
    [Authorize]
    public class DiscountsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public DiscountsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // POST: api/discounts/apply
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyDiscount(ApplyDiscountDto dto)
        {
            var discount = await _context.Discounts
                .FirstOrDefaultAsync(d =>
                    d.code == dto.code &&
                    d.is_active == true &&
                    (d.start_date == null || d.start_date <= DateTime.Now) &&
                    (d.end_date == null || d.end_date >= DateTime.Now)
                );

            if (discount == null)
                return BadRequest("Mã giảm giá không hợp lệ hoặc đã hết hạn");

            decimal discountAmount = 0;

            if (discount.discount_type == "percent")
            {
                discountAmount = dto.order_total * (discount.value / 100);
            }
            else if (discount.discount_type == "fixed")
            {
                discountAmount = discount.value;
            }

            var finalTotal = dto.order_total - discountAmount;
            if (finalTotal < 0) finalTotal = 0;

            return Ok(new
            {
                discount_id = discount.id,
                discount_type = discount.discount_type,
                discount_value = discount.value,
                discountAmount,
                finalTotal
            });
        }
    }
}
