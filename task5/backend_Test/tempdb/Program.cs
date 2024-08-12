// See https://aka.ms/new-console-template for more information

using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using tempdb.Model;
class Program {
    // public void Read(){
    //     var db = new TempOperations();
    //     foreach (var row in db.ReadRow()){
    //         Console.WriteLine(row.Email);
    //     }
        
    // }
    
    public static void Main (string[] args){
        // Program p = new Program();
        // TempOperations t = new TempOperations();
        // t.CreateRow(new Temp {Id=4,Email="manav@gmail.com"});
        // foreach (var row in t.ReadRow()){
        //     Console.WriteLine(row.Email);
        // }
        // Console.WriteLine(JsonSerializer.Serialize(new {Id=3,Email="manav@gmail.com"}));
        // p.Read();

        var factory = new ConnectionFactory { HostName = "localhost" };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        channel.QueueDeclare(queue: "Test",
                            durable: false,
                            exclusive: false,
                            autoDelete: false,
                            arguments: null);

        // var x =  {Id=3,Email="A@gmail.com"};
        string message = JsonSerializer.Serialize(new {Id=5,Email="manav@gmail.com"});
        // const string message = JsonSerializer.Serialize(x);
        var body = Encoding.UTF8.GetBytes(message);

        channel.BasicPublish(exchange: string.Empty,
                            routingKey: "Test",
                            basicProperties: null,
                            body: body);
        Console.WriteLine($"Sent {message}");

        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();

    }
}

// Console.WriteLine("Hello, World!");
