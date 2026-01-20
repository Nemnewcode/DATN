using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/product-toppings")]
    [Authorize(Roles = "Admin")]
    public class AdminProductToppingsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminProductToppingsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // ===============================
        // GET TOPPINGS OF PRODUCT
        // ===============================
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            var toppingIds = await _context.ProductToppings
                .Where(pt => pt.product_id == productId)
                .Select(pt => pt.topping_id)
                .ToListAsync();

            return Ok(toppingIds);
        }

        // ===============================
        // UPDATE TOPPINGS OF PRODUCT
        // ===============================
        [HttpPost("{productId}")]
        public async Task<IActionResult> Update(int productId, List<int> toppingIds)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound();

            var old = _context.ProductToppings
                .Where(pt => pt.product_id == productId);

            _context.ProductToppings.RemoveRange(old);

            foreach (var tid in toppingIds)
            {
                _context.ProductToppings.Add(new ProductTopping
                {
                    product_id = productId,
                    topping_id = tid
                });
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
