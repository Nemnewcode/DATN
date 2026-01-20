using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/product-images")]
    [Authorize(Roles = "Admin")]
    public class AdminProductImagesController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public AdminProductImagesController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // =========================================
        // ADD IMAGE (URL)
        // POST /api/admin/product-images/{productId}
        // BODY: { image_url: "https://..." }
        // =========================================
        [HttpPost("{productId}")]
        public async Task<IActionResult> Add(
            int productId,
            [FromBody] ProductImageCreateDto dto
        )
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound("Product not found");

            var image = new ProductImage
            {
                product_id = productId,
                image_url = dto.image_url,
                is_active = true,
                is_main = false
            };

            _context.ProductImages.Add(image);
            await _context.SaveChangesAsync();

            return Ok(image);
        }

        // =========================================
        // SET MAIN IMAGE
        // PATCH /api/admin/product-images/{id}/main
        // =========================================
        [HttpPatch("{id}/main")]
        public async Task<IActionResult> SetMain(int id)
        {
            var image = await _context.ProductImages.FindAsync(id);
            if (image == null) return NotFound();

            // ❗ bỏ main của tất cả ảnh cùng product
            var images = await _context.ProductImages
                .Where(i => i.product_id == image.product_id)
                .ToListAsync();

            foreach (var img in images)
            {
                img.is_main = false;
            }

            image.is_main = true;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // =========================================
        // TOGGLE IMAGE ACTIVE
        // PATCH /api/admin/product-images/{id}/toggle
        // =========================================
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var image = await _context.ProductImages.FindAsync(id);
            if (image == null) return NotFound();

            image.is_active = !(image.is_active ?? true);
            await _context.SaveChangesAsync();

            return Ok(image.is_active);
        }

        // =========================================
        // DELETE IMAGE
        // DELETE /api/admin/product-images/{id}
        // =========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var image = await _context.ProductImages.FindAsync(id);
            if (image == null) return NotFound();

            _context.ProductImages.Remove(image);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

    // =========================================
    // DTO
    // =========================================
    public class ProductImageCreateDto
    {
        public string image_url { get; set; } = null!;
    }
}
