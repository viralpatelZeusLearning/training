using System.Globalization;
using System.Text;
using CsvHelper;
using Mysqlx.Crud;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using tempdb.Model;
using Sqltrial;
using System.Diagnostics;
using CsvHelper.Configuration;

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
consumer.Received += async (model, ea) =>
{
    // var insert1 = new Insertmysql();
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    Console.WriteLine(message);
    if(File.Exists(message)){
        // var toaddContext = new TempContext();
        var config = new CsvConfiguration(CultureInfo.InvariantCulture){
            PrepareHeaderForMatch = args => args.Header.ToLower()
        };
        Stopwatch sw = new Stopwatch();
        sw.Start();
        var insert1 = new Insertmysql();
        using (var reader = new StreamReader(message))
        using (var csv = new CsvReader(reader, config))
        {
            // var records = csv.GetRecords<Temp>();
            var records = csv.GetRecords<MainModelWithoutMapped>().DistinctBy(x=>x.Email_Id).ToList();
            var MaxCount = 1000;
            var TaskList = new List<Task>();
            List<MainModelWithoutMapped> newList =  new();
            var percent  = (Double)MaxCount/Math.Max((Double)records.Count,(Double)MaxCount);
            /* foreach (var item in records)
            // {
            //     // if (toaddContext.Temps.Find(item.Id)==null && item.Id!=String.Empty){
            //         // Console.WriteLine($"{item.Id} : {item.Email}");
            //     // if (item.Email_Id!=String.Empty){
            //         newList.Add(item);
            //         currCount+=1;
            //         if (currCount == MaxCount){
            //             // var insert1 = new Insertmysql();
            //             await insert1.InsertBulk(newList , message);
            //             // try{
            //             //     await insert1.InsertBulk(newList , message);
            //             // }
            //             // catch(Exception e){
            //             //     Console.WriteLine(e);
            //             // }
            //             //insert1.InsertBulk(newList,"MyFile0");
            //             // toaddContext.AddRange(newList);
            //             // toaddContext.SaveChanges();
            //             currCount = 0;
            //             newList.Clear();
            //             // Console.WriteLine(count);
            //             // count++;
            //         }
            //     // }
            //     // else{
            //     //     Console.WriteLine("null val");
            //     //     // Console.WriteLine(item.Name);
            //     // }
            //         // toaddContext.Add(item);
            //         // toaddContext.SaveChanges();
            //     // }
            }*/
            
            
            for (int i=0;i<records.Count;i+=MaxCount){
                var smallList = records.Skip(i).Take(MaxCount).ToList();
                // TaskList.Add(insert1.InsertBulk(smallList,Path.GetFileName(message),percent,i));
                await insert1.InsertBulk(smallList,Path.GetFileName(message),percent,i);
            }
            
            // await Task.WhenAll(TaskList);
            /*if (currCount!=0){
                // var insert1 = new Insertmysql();
                await insert1.InsertBulk(newList,message);
                //insert1.InsertBulk(newList,"MyFile0");
            }*/
        }
        File.Delete(message);
        await insert1.CloseAsync();
        sw.Stop();
        Console.WriteLine(sw.Elapsed);
    }
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
