using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tempdb.Model;
using System.Threading.Channels;

namespace TempApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TempItemsController : ControllerBase
    {
        private readonly TempContext _context;
        private readonly IModel _channel;
        
        private string[] permittedExtensions = {".csv",".xlsx"};

        public TempItemsController(TempContext context)
        {
            _context = context;
            var factory = new ConnectionFactory { HostName = "localhost" };
            var connection = factory.CreateConnection();
            _channel = connection.CreateModel();

            _channel.QueueDeclare(queue: "Test",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);
        }

        // GET: api/TempItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Temp>>> GetTemps()
        {
            return await _context.Temps.ToListAsync();
        }

        // GET: api/TempItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Temp>> GetTemp(int id)
        {
            var temp = await _context.Temps.FindAsync(id);

            if (temp == null)
            {
                return NotFound();
            }

            return temp;
        }

        // PUT: api/TempItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTemp(string id, Temp temp)
        {
            if (id != temp.Id)
            {
                return BadRequest();
            }

            _context.Entry(temp).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TempItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Temp>> PostTemp(Temp temp)
        {
            _context.Temps.Add(temp);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTemp", new { id = temp.Id }, temp);
        }

        //POST:api/upload
        [HttpPost("upload")]
        public async Task<ActionResult<Temp>> UploadFile(IFormFile file)
        {
            Console.WriteLine(file.FileName);
            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !permittedExtensions.Contains(extension)){
                return BadRequest();
            }
            if (file.Length > 0)
            {
                var filePath = Path.Combine("../allFiles", Path.GetRandomFileName()+".csv");
                Console.WriteLine(filePath);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }
                // var x =  {Id=3,Email="A@gmail.com"};
                // const string message = JsonSerializer.Serialize(x);

                // string message = JsonSerializer.Serialize(new {Id=6,Email="manav@gmail.com"});
                // var body = Encoding.UTF8.GetBytes(message);
                var body = Encoding.UTF8.GetBytes(filePath);

                _channel.BasicPublish(exchange: string.Empty,
                                    routingKey: "Test",
                                    basicProperties: null,
                                    body: body);
                Console.WriteLine($"Sent {file.FileName}");
                return Ok();
            }
            else{
                return BadRequest();
            }
        }

        // DELETE: api/TempItems
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemp(int id)
        {
            var temp = await _context.Temps.FindAsync(id);
            if (temp == null)
            {
                return NotFound();
            }

            _context.Temps.Remove(temp);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempExists(string id)
        {
            return _context.Temps.Any(e => e.Id == id);
        }
    }
}
