
using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tempdb.Model;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Text.RegularExpressions;
using MongoDB.Driver;
using MongoStatus.model;

namespace TempApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MainController : ControllerBase
    {
        private readonly TempContext _context;

        private readonly IMongoCollection<MongoStatusClass> _StatusCollection;
        private readonly IModel _channel;
        
        private string[] permittedExtensions = {".csv",".xlsx"};

        public MainController(TempContext context, IMongoClient mongoClient)
        {
            _context = context;
            var dbName = mongoClient.GetDatabase("status");
            _StatusCollection = dbName.GetCollection<MongoStatusClass>("fileStatus");
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

        //[HttpGet("findIndex")]
        // public async Task<ActionResult<List<MainModel>>>findIndex(string sheetId , string Find , int page_no)
        // {
        //     int pageSize = 100;
        // }

        [HttpGet("Search")]
        public async Task<ActionResult<List<sheetWithIndex>>>Search(string sheetId, string searchText , int page_no=0)
        {
            var pageSize = 1000;
            var data = await _context.MainModels.Where(x=>x.Sheet_Id==sheetId).OrderBy(x=>x.Row_Id).Skip(page_no*pageSize).Take(pageSize).ToListAsync();
            var results = data.Select((x,index)=>new sheetWithIndex{Row_Index=page_no * pageSize + index, row_Data=x}).OrderBy(x => x.row_Data.Row_Id).Where(x=>(x.row_Data.Name != null && x.row_Data.Name.Contains(searchText)) ||
                x.row_Data.City != null && x.row_Data.City.Contains(searchText) ||
                x.row_Data.State != null && x.row_Data.State.Contains(searchText) ||
                x.row_Data.Country != null && x.row_Data.Country.Contains(searchText) ||
                x.row_Data.Telephone_no != null && x.row_Data.Telephone_no.Contains(searchText) ||
                x.row_Data.Address_Line_1 != null && x.row_Data.Address_Line_1.Contains(searchText) ||
                x.row_Data.Address_Line_2 != null && x.row_Data.Address_Line_2.Contains(searchText) ||
                x.row_Data.Date_of_Birth.ToString() != null && x.row_Data.Date_of_Birth.ToString().Contains(searchText) ||
                x.row_Data.FY_2019_20.ToString() != null && x.row_Data.FY_2019_20.ToString().Contains(searchText) ||
                x.row_Data.FY_2020_21.ToString() != null && x.row_Data.FY_2020_21.ToString().Contains(searchText) ||
                x.row_Data.FY_2021_22.ToString() != null && x.row_Data.FY_2021_22.ToString().Contains(searchText) ||
                x.row_Data.FY_2022_23.ToString() != null && x.row_Data.FY_2022_23.ToString().Contains(searchText) ||
                x.row_Data.FY_2023_24.ToString() != null && x.row_Data.FY_2023_24.ToString().Contains(searchText)).ToList();
 
                return results;
        }

        // GET: api/TempItems/5
        [HttpGet("{SheetId}")]
        public async Task<ActionResult<Dictionary<string , object>>> GetSingle(string SheetId,int page_no=0)
        {
            if (string.IsNullOrWhiteSpace(SheetId))
            {
                return BadRequest("SheetId cannot be null or empty.");
            }

            if (page_no < 0)
            {
                return BadRequest("Page number cannot be negative.");
            }
            int takeSize=1000;
            var result = new Dictionary<string,object>();
            result.Add("data", await _context.MainModels.Where(x=>x.Sheet_Id == SheetId).OrderBy(x=>x.Row_Id).Skip(page_no*takeSize).Take(takeSize).ToListAsync());
            result.Add("count" , await _context.MainModels.Where(x=>x.Sheet_Id == SheetId).CountAsync());
            return result;

            // if (temp == null)
            // {
            //     return NotFound();
            // }

            // return temp;
        }

        [HttpGet("SheetsList")]
        public async Task<ActionResult<List<string>>>GetFileList()
        {
            return await _context.Status.Select(x=>x.fileId).ToListAsync();
        }
        // PUT: api/TempItems/5
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
        [HttpPost("singleRowPost")]
        public async Task<ActionResult<MainModel>> PostSingleRow(MainModel? temp)
        {
            if (temp == null){
                return BadRequest("Body cannot be null");
            }
            // if (!ModelState.IsValid){
            //     return BadRequest("wrong type of data");
            // }
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

                //mongo insert
                await _StatusCollection.InsertOneAsync(new MongoStatusClass{fileId=Path.GetFileName(filePath)});


                Console.WriteLine(filePath);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }
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
        public async Task<IActionResult> DeleteTemp([FromBody]List<string> EmailId, string SheetId)
        {
            if (EmailId == null || SheetId == null){
                return BadRequest("Enter valid Data");
            }
            // int firstDeleteIndex = (await _context.MainModels.Where(x=>x.Sheet_Id == SheetId && x.Email_Id == EmailId[0]).ToListAsync())[0].Row_Id;
            await _context.MainModels.Where(x=>x.Sheet_Id==SheetId && EmailId.Contains(x.Email_Id)).ExecuteDeleteAsync();
            return NoContent();
        }

        //patch for update
        [HttpPatch("Update")]
        public async Task<ActionResult<MainModel>> UpdateSingleRow([FromBody]Dictionary<string, Dictionary<string,object>> newValues  , string SheetId)
        {
            var oldValues = await _context.MainModels.Where(x=>x.Sheet_Id == SheetId && newValues.Keys.Contains(x.Email_Id)).ToDictionaryAsync(x=>x.Email_Id);
            foreach (var item in oldValues.Keys)
            {
                // var oldValues = await _context.MainModels.Where(x=>x.Sheet_Id == SheetId && x.Email_Id == item).ToListAsync();
                // Console.WriteLine(item);
                foreach (var item1 in newValues[item].Keys)
                {
                    // Console.WriteLine(item1);
                    switch (item1.ToLower())
                    {
                        case "email_id":
                            string Email_pattern =  @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$";
                            bool EmailMatch = Regex.IsMatch(newValues[item][item1].ToString(),Email_pattern);
                            if (newValues[item][item1]!= null && EmailMatch){
                                // oldValues[0].Email_Id = newValues[item][item1].ToString();
                                var Email = oldValues[item];
                                _context.Remove(Email);
                                await _context.SaveChangesAsync();
                                Email.Email_Id = newValues[item][item1].ToString();
                                _context.Add(Email);
                            }
                            else{
                                return BadRequest();
                            }
                            break;
                        case "name":
                        oldValues[item].Name = newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "country":
                        oldValues[item].Country =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "state":
                        oldValues[item].State =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "city":
                        oldValues[item].City =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "telephone_no":
                        string pattern = @"^\d{10}$";  // Pattern to match exactly 10 digits
                            bool isMatch = Regex.IsMatch(oldValues[item].Telephone_no = newValues[item][item1]?.ToString(), pattern);
                            if(isMatch){
                                oldValues[item].Telephone_no =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                            }
                            else{
                                return BadRequest("Telephone number invalid");
                            }
                        break;
                        case "address_line_1":
                        oldValues[item].Address_Line_1 =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "address_line_2":
                        oldValues[item].Address_Line_2 =  newValues[item][item1] != null ?  newValues[item][item1].ToString() : null;
                        break;
                        case "date_of_birth":
                        oldValues[item].Date_of_Birth = newValues[item][item1] != null ? Convert.ToDateTime(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2019_20":
                        oldValues[item].FY_2019_20 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2020_21":
                        oldValues[item].FY_2020_21 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2021_22":
                        oldValues[item].FY_2021_22 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2022_23":
                        oldValues[item].FY_2022_23 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
                        break;
                        case "fy_2023_24":
                        oldValues[item].FY_2023_24 = newValues[item][item1] != null ? Convert.ToSingle(newValues[item][item1].ToString()) : null;
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
