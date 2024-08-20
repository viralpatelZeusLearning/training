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
    public class MainController : ControllerBase
    {
        private readonly TempContext _context;
        private readonly IModel _channel;
        
        private string[] permittedExtensions = {".csv",".xlsx"};

        public MainController(TempContext context)
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
        [HttpGet("singleRowGet")]
        public async Task<ActionResult<IEnumerable<MainModel>>> GetSingleRow(string EmailId , string SheetId)
        {
            return await _context.MainModels.Where(x=>x.Email_Id == EmailId && x.Sheet_Id == SheetId).ToListAsync();  
            // await _context.SaveChangesAsync();

            // return CreatedAtAction("GetSingleRow", new { id = temp.Email_Id }, temp);
        }

        // GET: api/TempItems/5
        [HttpGet("{SheetId}")]
        public async Task<ActionResult<IEnumerable<MainModel>>> GetSingle(string SheetId,int page_no=0)
        {
            int takeSize=100;
            return await _context.MainModels.Where(x=>x.Sheet_Id == SheetId).Skip(page_no*takeSize).Take(takeSize).ToListAsync();

            // if (temp == null)
            // {
            //     return NotFound();
            // }

            // return temp;
        }

        // PUT: api/TempItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*[HttpPut("{EmailId}")]
        public async Task<IActionResult> PutTemp(string EmailId, MainModel temp)
        {
            if (EmailId != temp.Email_Id)
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
                if (!TempExists(EmailId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }*/

        // POST: api/TempItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("singleRowPost")]
        public async Task<ActionResult<MainModel>> PostSingleRow(MainModel temp)
        {
            _context.MainModels.Add(temp);  
            await _context.SaveChangesAsync();

            return CreatedAtAction("PostSingleRow", new { id = temp.Email_Id }, temp);
        }

        //POST:api/upload
        [HttpPost("upload")]
        public async Task<ActionResult> UploadFile(IFormFile file)
        {
            Console.WriteLine(file.FileName);
            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !permittedExtensions.Contains(extension)){
                return BadRequest();
            }
            if (file.Length > 0)
            {
                var filePath = Path.Combine("../allFiles", Path.GetRandomFileName()+".csv");
                _context.Status.Add(new Status.model.StatusClass {fileId=Path.GetFileName(filePath)});
                await _context.SaveChangesAsync();
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
        [HttpDelete("{EmailId}")]
        public async Task<IActionResult> DeleteTemp(string EmailId, string SheetId)
        {
            await _context.MainModels.Where(x=>x.Sheet_Id == SheetId && x.Email_Id == EmailId).ExecuteDeleteAsync();
            return NoContent();
            // var temp = await _context.MainModels.FindAsync(EmailId);
            // if (temp == null)
            // {
            //     return NotFound();
            // }

            // _context.MainModels.Remove(temp);
            // await _context.SaveChangesAsync();

            // return NoContent();
        }

        //patch for update
        [HttpPatch("Update")]
        public async Task<ActionResult<MainModel>> UpdateSingleRow(MainModel newValues , string EmailId , string SheetId)
        {
            var oldValues = await _context.MainModels.Where(x=>x.Email_Id == EmailId && x.Sheet_Id == SheetId).ToListAsync();
            if (oldValues.Count !=0){
                oldValues[0].Name = newValues.Name;
                oldValues[0].Country = newValues.Country;
                oldValues[0].State = newValues.State;
                oldValues[0].City = newValues.City;
                oldValues[0].Telephone_no = newValues.Telephone_no;
                oldValues[0].Address_Line_1 = newValues.Address_Line_1;
                oldValues[0].Address_Line_2 = newValues.Address_Line_2;
                oldValues[0].Date_of_Birth = newValues.Date_of_Birth;
                oldValues[0].FY_2019_20 = newValues.FY_2019_20;
                oldValues[0].FY_2020_21 = newValues.FY_2020_21;
                oldValues[0].FY_2021_22 = newValues.FY_2021_22;
                oldValues[0].FY_2022_23 = newValues.FY_2022_23;
                oldValues[0].FY_2023_24 = newValues.FY_2023_24;
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TempExists(string id)
        {
            return _context.MainModels.Any(e => e.Email_Id == id);
        }
    }
}
