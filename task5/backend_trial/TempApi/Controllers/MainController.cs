
using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tempdb.Model;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

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
        [HttpGet("Search")]
        public async Task<ActionResult<List<MainModel>>>Search(string sheetId, string Search , int page_no=0)
        {
            var size=10;
            return await _context.MainModels.Where(x=>x.Sheet_Id == sheetId && x.Name.Contains(Search)
            || x.Email_Id.Contains(Search)
            || x.Country.Contains(Search)
            || x.City.Contains(Search)
            || x.State.Contains(Search)
            || x.Telephone_no.Contains(Search)
            || x.Address_Line_1.Contains(Search)
            || x.Address_Line_2.Contains(Search)
            || x.Date_of_Birth.ToString().Contains(Search)
            || x.FY_2019_20.ToString().Contains(Search)
            || x.FY_2020_21.ToString().Contains(Search)
            || x.FY_2021_22.ToString().Contains(Search)
            || x.FY_2022_23.ToString().Contains(Search)
            || x.FY_2023_24.ToString().Contains(Search)).Skip(page_no*size).Take(size).ToListAsync();
            // var query = "select * from mainmodels where Match(*) against (@Search)";
            // return await _context.MainModels.FromSqlRaw(query,new MySqlParameter("@Search",Search)).ToListAsync();
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
                return Ok(Path.GetFileName(filePath));
            }
            else{
                return BadRequest();
            }
        }

        // DELETE: api/TempItems
        [HttpDelete]
        public async Task<IActionResult> DeleteTemp([FromQuery]List<string> EmailId, string SheetId)
        {
            // int firstDeleteIndex = (await _context.MainModels.where(x=>x.sheetId == SheetId && x.Email_Id == EmailId).ToListAsync())[0].Row_Id;
            await _context.MainModels.Where(x=>x.Sheet_Id==SheetId && EmailId.Contains(x.Email_Id)).ExecuteDeleteAsync();
            // await _context.MainModels.Where(x=>x.Row_Id == firstDeleteIndex).ExecuteUpdateAsync()
            // EmailId.ForEach(async e=>{
            //     await _context.MainModels.Where(x=>x.Sheet_Id == SheetId && x.Email_Id == e).ExecuteDeleteAsync();
            // });
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
        public async Task<ActionResult<MainModel>> UpdateSingleRow([FromBody]Dictionary<string, Dictionary<string,object>> newValues  , string SheetId)
        {
            foreach (var item in newValues.Keys.ToList())
            {
                var oldValues = await _context.MainModels.Where(x=>x.Sheet_Id == SheetId && x.Email_Id == item).ToListAsync();
                // Console.WriteLine(item);
                foreach (var item1 in newValues[item].Keys.ToList())
                {
                    // Console.WriteLine(item1);
                    switch (item1.ToLower())
                    {
                        case "email_id":
                            if (newValues[item][item1]!= null){
                                oldValues[0].Email_Id = newValues[item][item1].ToString();
                            }
                            break;
                        case "name":
                        oldValues[0].Name = newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "country":
                        oldValues[0].Country =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "state":
                        oldValues[0].State =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "city":
                        oldValues[0].City =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "telephone_no":
                        oldValues[0].Telephone_no =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "address_line_1":
                        oldValues[0].Address_Line_1 =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "address_line_2":
                        oldValues[0].Address_Line_2 =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "date_of_birth":
                        oldValues[0].Date_of_Birth = newValues[item][item1] != null ? Convert.ToDateTime(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2019_20":
                        oldValues[0].FY_2019_20 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2020_21":
                        oldValues[0].FY_2020_21 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2021_22":
                        oldValues[0].FY_2021_22 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2022_23":
                        oldValues[0].FY_2022_23 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2023_24":
                        oldValues[0].FY_2023_24 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        
                        // default:
                    }
                }
                /* if (oldValues.Count !=0){
                //     oldValues[0].Name = newValues[item].Name;
                //     oldValues[0].Country = newValues[item].Country;
                //     oldValues[0].State = newValues[item].State;
                //     oldValues[0].City = newValues[item].City;
                //     oldValues[0].Telephone_no = newValues[item].Telephone_no;
                //     oldValues[0].Address_Line_1 = newValues[item].Address_Line_1;
                //     oldValues[0].Address_Line_2 = newValues[item].Address_Line_2;
                //     oldValues[0].Date_of_Birth = newValues[item].Date_of_Birth;
                //     oldValues[0].FY_2019_20 = newValues[item].FY_2019_20;
                //     oldValues[0].FY_2020_21 = newValues[item].FY_2020_21;
                //     oldValues[0].FY_2021_22 = newValues[item].FY_2021_22;
                //     oldValues[0].FY_2022_23 = newValues[item].FY_2022_23;
                //     oldValues[0].FY_2023_24 = newValues[item].FY_2023_24;
                 }*/
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
