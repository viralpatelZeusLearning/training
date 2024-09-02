using Microsoft.AspNetCore.Mvc;
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
            _collection = database.GetCollection<MongoStatusClass>("statuscoll");
        }

        [HttpGet("{sheetId}")]
        public async Task<IActionResult> MongoUploadStatus(string SheetId)
        {
            var file = await _collection.FindAsync(x=>x.fileId == SheetId);
            Console.WriteLine(file.FirstOrDefault());
            return Ok();
            // if (file!=null){
            //     return file.percentage;  
            // }
            // else{
            //     return BadRequest("Enter valid sheetId");
            // }
        }

        [HttpGet("findSheet")]
        public async Task<ActionResult<Boolean>>Sheet(string SheetId)
        {
            var file = await _collection.FindAsync(SheetId);
            return Ok();
            // if (file != null || file.percentage != 1){
            //     return true;
            // }
            // else{
            //     return false;
            // }
        }
    }
}