
using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tempdb.Model;
using Status.model;

namespace TempApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly TempContext _context;
        

        public StatusController(TempContext context)
        {
            _context = context;
        }

        // GET: api/TempItems
        [HttpGet("{SheetId}")]
        public async Task<ActionResult<double>>Status(string SheetId)
        {
            var file = _context.Status.Where(x=> x.fileId == SheetId).FirstOrDefault();
            if (file!=null){

                return file.percentage;  
            }
            else{
                return BadRequest("Enter valid sheetId");
            }
        }

        //get check if file exist
        [HttpGet("findSheet")]
        public async Task<ActionResult<Boolean>>Sheet(string SheetId)
        {
            var file = await _context.Status.FindAsync(SheetId);
            if (file != null || file.percentage != 1){
                return true;
            }
            else{
                return false;
            }
        }
    }
}
