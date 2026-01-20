using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/products/{productId}/images")]
    // [Authorize(Roles = "Admin")]
    public class ProductImagesController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public ProductImagesController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // POST: api/products/{productId}/images
        [HttpPost]
        public async Task<IActionResult> Upload(int productId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File không hợp lệ");

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
                return NotFound("Sản phẩm không tồn tại");

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var folder = Path.Combine("wwwroot/uploads/products");
            var path = Path.Combine(folder, fileName);

            Directory.CreateDirectory(folder);

            using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);

            var image = new ProductImage
            {
                product_id = productId,
                image_url = "/uploads/products/" + fileName,
                is_main = false,
                is_active = true
            };

            _context.ProductImages.Add(image);
            await _context.SaveChangesAsync();

            return Ok(image);
        }

        // PATCH: api/products/{productId}/images/{imageId}/set-main
        [HttpPatch("{imageId}/set-main")]
        public async Task<IActionResult> SetMain(int productId, int imageId)
        {
            var image = await _context.ProductImages
                .FirstOrDefaultAsync(i => i.id == imageId && i.product_id == productId);

            if (image == null)
                return NotFound();

            var images = _context.ProductImages
                .Where(i => i.product_id == productId && i.is_active == true);

            foreach (var img in images)
                img.is_main = false;

            image.is_main = true;

            var product = await _context.Products.FindAsync(productId);
            product.image = image.image_url;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã đặt ảnh chính" });
        }

        // DELETE: api/products/{productId}/images/{imageId}
        [HttpDelete("{imageId}")]
        public async Task<IActionResult> Delete(int productId, int imageId)
        {
            var image = await _context.ProductImages
                .FirstOrDefaultAsync(i => i.id == imageId && i.product_id == productId);

            if (image == null)
                return NotFound();

            if (image.is_main == true)
                return BadRequest("Không thể xóa ảnh chính");

            image.is_active = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa ảnh" });
        }
    }
}
