using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using tempdb.Model;
using TempOperations_namespace;

var factory = new ConnectionFactory { HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

// channel.QueueDeclare(queue: "Test",
//                      durable: false,
//                      exclusive: false,
//                      autoDelete: false,
//                      arguments: null);
var TempOps =new TempOperations();
// var message = JsonSerializer.Deserialize(new body);
Console.WriteLine(" Waiting for messages.");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    var msg=JsonSerializer.Deserialize<Temp>(message);
    TempOps.CreateRow(msg);
    Console.WriteLine($" Received {msg.Email}");
};
channel.BasicConsume(queue: "Test",
                     autoAck: true,
                     consumer: consumer);

foreach (var row in TempOps.ReadRow()){
    Console.WriteLine(row.Email);
}
Console.WriteLine(" Press [enter] to exit.");
Console.ReadLine();
