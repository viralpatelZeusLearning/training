using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

var factory = new ConnectionFactory { HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(queue: "Test",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

// var x =  {Id=3,Email="A@gmail.com"};
const string message = "Helllo World";
// const string message = JsonSerializer.Serialize(x);
var body = Encoding.UTF8.GetBytes(message);

channel.BasicPublish(exchange: string.Empty,
                     routingKey: "Test",
                     basicProperties: null,
                     body: body);
Console.WriteLine($"Sent {message}");

Console.WriteLine(" Press [enter] to exit.");
Console.ReadLine();