using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoStatus.model;

namespace Mongo.controller
{
    public class MongoStatusController:ControllerBase
    {
        public readonly IMongoCollection<MongoStatusClass> _collection;
        public MongoStatusController (IMongoClient client)
        {
            var database = client.GetDatabase("status");
            _collection = database.GetCollection<MongoStatusClass>("fileStatus");
        }

        [HttpGet("AllSheet")]
        public async Task<ActionResult<List<string>>>Sheet()
        {
            var queryCollection = _collection.AsQueryable();
            var result = await queryCollection.Select(x=>x.fileId).ToListAsync();
            return result;
        }

        [HttpGet("getPercentage")]
        public async Task<ActionResult<double>> GetPercentage(string sheetId)
        {
            var doc = await _collection.Find(x => x.fileId == sheetId).FirstOrDefaultAsync();
            // Console.WriteLine(doc.percentage);
            if (doc!=null){
                return doc.percentage;
            }
            else{
                return BadRequest("Enter an valid Sheet Id");
            }
        }

        [HttpPost("upload")]
        public async Task<ActionResult>UploadFile(IFormFile file)
        {
            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var filePath = Path.Combine("../allFiles", Path.GetRandomFileName()+".csv");
            await _collection.InsertOneAsync(new MongoStatusClass{fileId = Path.GetFileName(filePath)});
            using (var stream = System.IO.File.Create(filePath)){
                await file.CopyToAsync(stream);
            }
            var body = Encoding.UTF8.GetBytes(filePath);

            return Ok(Path.GetFileName(filePath));
        }
    }
}