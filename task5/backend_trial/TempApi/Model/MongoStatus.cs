using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MongoStatus.model;

public class MongoStatusClass{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public required string fileId{get;set;}
    public double percentage{get;set;} = 0;
}