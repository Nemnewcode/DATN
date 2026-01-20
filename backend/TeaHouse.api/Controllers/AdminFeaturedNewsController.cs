using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.api.Models;
using System.Security.Claims;
using TeaHouse.Api.Data;

namespace TeaHouse.api.Controllers.Admin
{
    [Route("api/admin/featured-news")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminFeaturedNewsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminFeaturedNewsController(
            TeaHouseDbContext context,
            IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // =====================================================
        // GET: api/admin/featured-news (list cho dashboard)
        // =====================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.FeaturedNews
                .Include(x => x.drink)
                .Include(x => x.created_byNavigation)
                .OrderByDescending(x => x.created_at)
                .Select(x => new
                {
                    x.id,
                    x.title,
                    x.slug,
                    x.thumbnail,
                    x.is_active,
                    x.created_at,
                    created_by = x.created_byNavigation.name,
                    drink_name = x.drink.name
                })

                .ToListAsync();

            return Ok(data);
        }

        // =====================================================
        // GET: api/admin/featured-news/{id}
        // =====================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var news = await _context.FeaturedNews
                .Include(x => x.drink)
                .FirstOrDefaultAsync(x => x.id == id);

            if (news == null) return NotFound();
            return Ok(news);
        }

        // =====================================================
        // POST: api/admin/featured-news
        // =====================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] FeaturedNewsCreateDto dto)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            string? thumbnailPath = null;
            if (dto.thumbnail != null)
            {
                thumbnailPath = await SaveThumbnail(dto.thumbnail);
            }

            var news = new FeaturedNews
            {
                title = dto.title,
                slug = dto.slug,
                short_description = dto.short_description,
                recipe_content = dto.recipe_content,
                thumbnail = thumbnailPath,
                drink_id = dto.drink_id,
                is_active = dto.is_active,
                created_at = DateTime.Now,
                created_by = userId
            };

            _context.FeaturedNews.Add(news);
            await _context.SaveChangesAsync();

            return Ok(news);
        }

        // =====================================================
        // PUT: api/admin/featured-news/{id}
        // =====================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromForm] FeaturedNewsUpdateDto dto)
        {
            var news = await _context.FeaturedNews.FindAsync(id);
            if (news == null) return NotFound();

            if (dto.thumbnail != null)
            {
                DeleteThumbnail(news.thumbnail);
                news.thumbnail = await SaveThumbnail(dto.thumbnail);
            }

            news.title = dto.title;
            news.slug = dto.slug;
            news.short_description = dto.short_description;
            news.recipe_content = dto.recipe_content;
            news.drink_id = dto.drink_id;
            news.is_active = dto.is_active;
            news.updated_at = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(news);
        }

        // =====================================================
        // DELETE: api/admin/featured-news/{id}
        // =====================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var news = await _context.FeaturedNews.FindAsync(id);
            if (news == null) return NotFound();

            DeleteThumbnail(news.thumbnail);
            _context.FeaturedNews.Remove(news);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Deleted successfully" });
        }

        // ============================
        // Helpers
        // ============================
        private async Task<string> SaveThumbnail(IFormFile file)
        {
            var folder = Path.Combine(
                _env.WebRootPath,
                "uploads",
                "featured-news"
            );

            Directory.CreateDirectory(folder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var path = Path.Combine(folder, fileName);

            using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);

            return "/uploads/featured-news/" + fileName;
        }

        private void DeleteThumbnail(string? path)
        {
            if (string.IsNullOrEmpty(path)) return;

            var fullPath = Path.Combine(
                _env.WebRootPath,
                path.TrimStart('/')
            );

            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }
        }
    }
}
