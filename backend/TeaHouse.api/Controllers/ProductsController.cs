using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public ProductsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // ===============================
        // GET: api/products
        // ===============================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.category) // ✅ SỬA
                .Where(p => p.is_active == true)
                .Select(p => new
                {
                    p.id,
                    p.name,
                    p.price,
                    image = p.ProductImages
                        .Where(i => i.is_main == true)
                        .Select(i => i.image_url)
                        .FirstOrDefault(),

                    category_id = p.category_id,
                    category_slug = p.category.slug,   // ✅ SỬA
                    category_name = p.category.name,   // ✅ SỬA

                    toppings = p.ProductToppings
                        .Where(pt => pt.topping.is_active == true)
                        .Select(pt => new
                        {
                            pt.topping.id,
                            pt.topping.name,
                            pt.topping.price
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(products);
        }

        // ===============================
        // GET: api/products/{id}
        // ===============================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Where(p => p.id == id)
                .Select(p => new
                {
                    p.id,
                    p.name,
                    p.price,
                    p.description,
                    p.image,
                    p.status,

                    category = new
                    {
                        p.category.id,     // ✅ SỬA
                        p.category.name
                    },

                    toppings = p.ProductToppings
                        .Where(pt => pt.topping.is_active == true)
                        .Select(pt => new
                        {
                            pt.topping.id,
                            pt.topping.name,
                            pt.topping.price
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // ===============================
        // GET: api/products/by-category/{slug}
        // ===============================
        [HttpGet("by-category/{slug}")]
        public async Task<IActionResult> GetByCategory(string slug)
        {
            var products = await _context.Products
                .Include(p => p.category) // ✅ SỬA
                .Include(p => p.ProductImages)
                .Include(p => p.ProductToppings)
                    .ThenInclude(pt => pt.topping)
                .Where(p =>
                    p.category.slug == slug && // ✅ SỬA
                    p.is_active == true
                )
                .Select(p => new
                {
                    p.id,
                    p.name,
                    p.price,
                    image = p.ProductImages
                        .Where(i => i.is_main == true)
                        .Select(i => i.image_url)
                        .FirstOrDefault(),

                    toppings = p.ProductToppings
                        .Where(pt => pt.topping.is_active == true)
                        .Select(pt => new
                        {
                            pt.topping.id,
                            pt.topping.name,
                            pt.topping.price
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(products);
        }
    }
}
