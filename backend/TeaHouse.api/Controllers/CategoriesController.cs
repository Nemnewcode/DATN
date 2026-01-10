using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public CategoriesController(TeaHouseDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories
                .Where(c => c.is_active == true) 
                .Select(c => new
                {
                    c.id,
                    c.name,
                    c.slug
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
