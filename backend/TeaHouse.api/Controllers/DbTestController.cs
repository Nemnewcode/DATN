using Microsoft.AspNetCore.Mvc;
using TeaHouse.Api.Data;

namespace TeaHouse.Api.Controllers
{
    [ApiController]
    [Route("api/dbtest")]
    public class DbTestController : ControllerBase
    {
        private readonly TeaHouseDbContext _context;

        public DbTestController(TeaHouseDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Test()
        {
            return Ok("Kết nối SQL Server thành công");
        }
    }
}
