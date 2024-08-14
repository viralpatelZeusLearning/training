using System.Globalization;
using System.Text;
using CsvHelper;
using Mysqlx.Crud;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using tempdb.Model;
using Sqltrial;
using System.Diagnostics;

var insert1 = new Insertmysql();
var factory = new ConnectionFactory { HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(queue: "Test",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);
// var message = JsonSerializer.Deserialize(new body);
Console.WriteLine(" Waiting for messages.");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    Console.WriteLine(message);
    // if (File.Exists(message)){
    //     var toadd =new TempContext();

    //     Console.WriteLine(message);
    //     using (var reader = new StreamReader(message))
    //     using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
    //     {
    //         var records = csv.GetRecords<Temp>();
    //         // Console.WriteLine(records);
    //         foreach (var item in records)
    //         {
    //             Console.WriteLine(item.Id);
    //             toadd.Add(item);
    //             toadd.SaveChanges();
    //             Console.WriteLine("completed");
    //         }
    //         // Console.WriteLine("done");
    //     }
    // }
    if(File.Exists(message)){
        // var toaddContext = new TempContext();
        Stopwatch sw = new Stopwatch();
        sw.Start();
        using (var reader = new StreamReader(message))
        using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
        {
            var records = csv.GetRecords<Temp>();
            // Console.WriteLine(File.ReadAllLines(message).Length);
            var currCount = 0;
            var MaxCount = 1000;
            var count = 0;
            List<Temp> newList = new();
            foreach (var item in records)
            {
                // if (toaddContext.Temps.Find(item.Id)==null && item.Id!=String.Empty){
                    // Console.WriteLine($"{item.Id} : {item.Email}");
                if (item.Id != null && item.Id!=String.Empty){
                    newList.Add(item);
                    currCount+=1;
                    if (currCount == MaxCount){
                        insert1.InsertBulk(newList);
                        // toaddContext.AddRange(newList);
                        // toaddContext.SaveChanges();
                        currCount = 0;
                        newList.Clear();
                        Console.WriteLine(count);
                        count++;
                    }
                }
                else{
                    Console.WriteLine("null val");
                }
                    // toaddContext.Add(item);
                    // toaddContext.SaveChanges();
                // }
            }
            if (currCount!=0){
                insert1.InsertBulk(newList);
            }
        }
        File.Delete(message);
        sw.Stop();
        Console.WriteLine(sw.Elapsed);
    }
    // Console.WriteLine($"Received {message}");

    // var msg=JsonSerializer.Deserialize<Temp>(message);
    // TempOps.CreateRow(msg);
    Console.WriteLine($" Received {message}");
};
channel.BasicConsume(queue: "Test",
                     autoAck: true,
                     consumer: consumer);

// foreach (var row in TempOps.ReadRow()){
//     Console.WriteLine(row.Email);
// }
Console.WriteLine(" Press [enter] to exit.");
Console.ReadLine();
