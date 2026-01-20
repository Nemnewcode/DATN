using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.Api.DTOs;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/products")]
    [Authorize(Roles = "Admin")]
    public class AdminProductsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminProductsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET ALL (ADMIN LIST)
        // =====================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.category)
                .Include(p => p.ProductImages)
                .OrderByDescending(p => p.id)
                .Select(p => new
                {
                    p.id,
                    p.name,
                    p.price,
                    p.status,
                    is_active = p.is_active ?? false,
                    category = p.category.name,

                    main_image = p.ProductImages
                        .Where(i => i.is_active == true && i.is_main == true)
                        .Select(i => i.image_url)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(products);
        }

        // =====================================================
        // GET BY ID (EDIT)
        // =====================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .Where(p => p.id == id)
                .Select(p => new
                {
                    p.id,
                    p.name,
                    p.price,
                    p.category_id,
                    p.description,
                    is_active = p.is_active ?? false,
                    status = p.status,

                    images = p.ProductImages
                        .Where(i => i.is_active == true)
                        .Select(i => new
                        {
                            i.id,
                            i.image_url,
                            is_main = i.is_main ?? false
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // =====================================================
        // CREATE PRODUCT + IMAGES
        // =====================================================
        [HttpPost]
        public async Task<IActionResult> Create(ProductCreateDto dto)
        {
            var product = new Product
            {
                name = dto.name,
                price = dto.price,
                category_id = dto.category_id,
                description = dto.description,
                is_active = true,
                status = "available"
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            if (dto.images != null && dto.images.Any())
            {
                for (int i = 0; i < dto.images.Count; i++)
                {
                    _context.ProductImages.Add(new ProductImage
                    {
                        product_id = product.id,
                        image_url = dto.images[i],
                        is_active = true,
                        is_main = (i == 0)
                    });
                }

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Tạo sản phẩm thành công",
                product_id = product.id
            });
        }

        // =====================================================
        // UPDATE PRODUCT
        // =====================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProductUpdateDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.name = dto.name;
            product.price = dto.price;
            product.category_id = dto.category_id;
            product.description = dto.description;
            product.is_active = dto.is_active;
            product.status = dto.is_active ? "available" : "unavailable";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật sản phẩm thành công" });
        }

        // =====================================================
        // TOGGLE ACTIVE
        // =====================================================
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            bool newState = !(product.is_active ?? true);

            product.is_active = newState;
            product.status = newState ? "available" : "unavailable";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                product_id = product.id,
                is_active = newState,
                status = product.status
            });
        }
    }
}
