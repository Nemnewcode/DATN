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

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Where(p => p.is_active == true)
                .Select(p => new
                {
                    id = p.id,
                    name = p.name,
                    price = p.price,

                    image = p.ProductImages
                        .Where(i => i.is_main == true && i.is_active == true)
                        .Select(i => i.image_url)
                        .FirstOrDefault(),

                    status = p.status,

                    category = new
                    {
                        id = p.category.id,
                        name = p.category.name
                    },

                    toppings = p.ProductToppings.Select(pt => new
                    {
                        id = pt.topping.id,
                        name = pt.topping.name,
                        price = pt.topping.price
                    })
                })
                .ToListAsync();

            return Ok(products);
        }


        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Where(p => p.id == id)
                .Select(p => new
                {
                    id = p.id,
                    name = p.name,
                    price = p.price,
                    image = p.image,
                    description = p.description,
                    status = p.status,

                    category = new
                    {
                        id = p.category.id,
                        name = p.category.name
                    },

                    toppings = p.ProductToppings.Select(pt => new
                    {
                        id = pt.topping.id,
                        name = pt.topping.name,
                        price = pt.topping.price
                    })
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] api.Models.Product model)
        {
            _context.Products.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Tạo sản phẩm thành công",
                id = model.id
            });

        }
        [HttpGet("by-category/{slug}")]
        public async Task<IActionResult> GetByCategory(string slug)
        {
            var products = await _context.Products
                .Where(p => p.is_active == true && p.category.slug == slug)
                .Select(p => new
                {
                    p.id,
                    p.name,
                    p.price,

                    image = p.ProductImages
                        .Where(i => i.is_main == true && i.is_active == true)
                        .Select(i => i.image_url)
                        .FirstOrDefault(),

                    category = p.category.name
                })
                .ToListAsync();

            return Ok(products);
        }

    }
}
