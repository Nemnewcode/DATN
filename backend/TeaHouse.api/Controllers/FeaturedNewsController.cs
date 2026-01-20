using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/featured-news")]
    public class FeaturedNewsController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public FeaturedNewsController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // GET: api/featured-news
        [HttpGet]
        public async Task<IActionResult> GetPublic()
        {
            var news = await _context.FeaturedNews
                .Where(f => f.is_active == true)
                .OrderByDescending(f => f.created_at)
                .Select(f => new
                {
                    f.id,
                    f.title,
                    f.slug,
                    f.short_description,
                    thumbnail = f.thumbnail,

                    drink = new
                    {
                        f.drink.id,
                        f.drink.name,
                        f.drink.price,
                        f.drink.image
                    }
                })
                .ToListAsync();

            return Ok(news);
        }
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var news = await _context.FeaturedNews
                .Where(x => x.slug == slug && x.is_active == true)
                .Select(x => new
                {
                    x.id,
                    x.title,
                    x.slug,
                    x.thumbnail,
                    x.recipe_content,
                    x.created_at
                })
                .FirstOrDefaultAsync();

            if (news == null)
                return NotFound();

            return Ok(news);
        }
    }
}
