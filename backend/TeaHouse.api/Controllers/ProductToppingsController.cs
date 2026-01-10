using Microsoft.AspNetCore.Mvc;
using TeaHouse.api.Models;
using TeaHouse.Api.Data;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/product-toppings")]
    public class ProductToppingsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public ProductToppingsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // POST: api/product-toppings
        [HttpPost]
        public async Task<IActionResult> AddTopping(int productId, int toppingId)
        {
            var pt = new ProductTopping
            {
                product_id = productId,
                topping_id = toppingId
            };

            _context.ProductToppings.Add(pt);
            await _context.SaveChangesAsync();

            return Ok(pt);
        }
    }
}
