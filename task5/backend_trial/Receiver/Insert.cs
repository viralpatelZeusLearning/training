using tempdb.Model;
using System.Text;
using MySql.Data.MySqlClient;
using MongoDB.Driver;
using MongoStatus.model;


namespace Sqltrial;

public class Insertmysql {

    public readonly MySqlConnection conn;
    public readonly IMongoCollection<MongoStatusClass> _StatusCollection;
    public  Insertmysql()
    {
        string myconnection = "server=localhost;user=root;password=root;database=temp";
        conn = new MySql.Data.MySqlClient.MySqlConnection();
        conn.ConnectionString = myconnection;
        conn.Open();

        var mongoClient = new MongoClient("mongodb://localhost:27017");
        var dbName = mongoClient.GetDatabase("status");
        _StatusCollection = dbName.GetCollection<MongoStatusClass>(
            "fileStatus");
    }
    public void getdata()
    {
        // // System.Data.DataTable data = conn.GetSchema("MetaDataCollections");   
        // // Console.WriteLine(data);
        // string sql = "select * from temps";
        // MySqlCommand cmd = new MySqlCommand(sql,conn);
        // MySqlDataReader rdr = cmd.ExecuteReader();
        // //rdr.FileCount()
        // while (rdr.Read()){
        //     Console.WriteLine(rdr[0]);
        // }
        // rdr.Close();
    }
    public void EnterData(Temp o)
    {
        // var obj = new {Id="1",Email="V@gmail.com"};
        // string Insertval = $"insert into temps (Id , Email) values('{o.Id}','{o.Email}') as val on duplicate key update Email = val.Email;";
        // MySqlCommand cmd = new MySqlCommand(Insertval,conn);
        // cmd.ExecuteNonQuery();
    }

    //public void InsertBulk(List<Temp> DataList)
    public async Task InsertBulk(List<MainModelWithoutMapped> DataList , string sheetName,Double percent,int startIndex)
    {

        //string Bulkinsert2 = @"(@Email_Id,@sheetName,@Name,@Country,@State,@City,@Telephone_no,@Address_Lier_1,@Address_Line_2,@Date_of_Birth,@FY_2019_20
        //                        ,@FY_2020_21,@FY_2021_22,@FY_2022_23,@FY_2023_24)";
        string Bulkinsert1 = @$"insert into mainmodels (Email_Id , Sheet_Id ,Row_Id ,  Name, Country , State,City, Telephone_no ,
                                Address_Line_1,Address_Line_2,Date_of_Birth,FY_2019_20,FY_2020_21,FY_2021_22,FY_2022_23,FY_2023_24) values";

        var Bulkinsert2 = new StringBuilder();

        string Bulkinsert3 = @" as val on duplicate key update Name=val.Name, Country=val.Country , State=val.State,City=val.City, Telephone_no =val.Telephone_no,
                                Address_Line_1=val.Address_Line_1,Address_Line_2=val.Address_Line_2,Date_of_Birth=val.Date_of_Birth,FY_2019_20=val.FY_2019_20,
                                FY_2020_21=val.FY_2020_21,FY_2021_22=val.FY_2021_22,FY_2022_23=val.FY_2022_23,FY_2023_24=val.FY_2023_24;";

        foreach (var item in DataList)
        {
            if (item.Email_Id != string.Empty){
                Bulkinsert2.Append(@$"('{MySqlHelper.EscapeString(item.Email_Id)}','{MySqlHelper.EscapeString(sheetName)}',{startIndex++},'{MySqlHelper.EscapeString(item.Name)}'
                                        ,'{MySqlHelper.EscapeString(item.Country)}','{MySqlHelper.EscapeString(item.State)}','{MySqlHelper.EscapeString(item.City)}'
                                        ,'{MySqlHelper.EscapeString(item.Telephone_no)}','{MySqlHelper.EscapeString(item.Address_Line_1)}',
                                        '{MySqlHelper.EscapeString(item.Address_Line_2)}',
                                        '{item.Date_of_Birth?.ToString("yyyy-MM-dd")}',
                                        {item.FY_2019_20},{item.FY_2020_21},{item.FY_2021_22},{item.FY_2022_23},{item.FY_2023_24}),");
            }
        }
        // Console.WriteLine(Bulkinsert2);
        if (Bulkinsert2.Length>0){
            Bulkinsert2.Remove(Bulkinsert2.Length-1,1);

            string Bulkinsert = Bulkinsert1+Bulkinsert2+Bulkinsert3;
            // Console.WriteLine(Bulkinsert);
            MySqlCommand cmd = new MySqlCommand(Bulkinsert,conn);
            await cmd.ExecuteNonQueryAsync();
            string query = $"Update status set percentage=percentage+{percent} where fileId='{MySqlHelper.EscapeString(sheetName)}'";
            cmd = new MySqlCommand(query,conn);
            await cmd.ExecuteNonQueryAsync();
            // await conn.CloseAsync();

            var filter = Builders<MongoStatusClass>.Filter.Eq(item => item.fileId, sheetName);
            var update = Builders<MongoStatusClass>.Update.Inc(item => item.percentage, percent);
            await _StatusCollection.UpdateOneAsync(filter,update);
            // Console.WriteLine("updating");
        }
        // try{
        //     await cmd.ExecuteNonQueryAsync();
        // }
        // catch(Exception e){
        //     Console.WriteLine("Exception");
        // }

        /* foreach (var item in DataList)
        // {
        //         MySqlCommand cmd = new MySqlCommand(Bulkinsert,conn);
        //         cmd.Parameters.AddWithValue("@Email_Id",item.Email_Id);
        //         cmd.Parameters.AddWithValue("@sheetName",sheetName);
        //         cmd.Parameters.AddWithValue("@Name",item.Name);
        //         cmd.Parameters.AddWithValue("@Country",item.Country);
        //         cmd.Parameters.AddWithValue("@State",item.State);
        //         cmd.Parameters.AddWithValue("@City",item.City);
        //         cmd.Parameters.AddWithValue("@Telephone_no",item.Telephone_no);
        //         cmd.Parameters.AddWithValue("@Address_Line_1",item.Address_Line_1);
        //         cmd.Parameters.AddWithValue("@Address_Line_2",item.Address_Line_2);
        //         cmd.Parameters.AddWithValue("@Date_of_Birth",item.Date_of_Birth?.ToString("yyyy-MM-dd"));
        //         cmd.Parameters.AddWithValue("@FY_2019_20",item.FY_2019_20);
        //         cmd.Parameters.AddWithValue("@FY_2020_21",item.FY_2020_21);
        //         cmd.Parameters.AddWithValue("@FY_2021_22",item.FY_2021_22);
        //         cmd.Parameters.AddWithValue("@FY_2022_23",item.FY_2022_23);
        //         cmd.Parameters.AddWithValue("@FY_2023_24",item.FY_2023_24);
        //         cmd.ExecuteNonQuery();
         }*/
    }
    public async Task CloseAsync(){
            await conn.CloseAsync();
    }
    
    public static void Main(string[] args){
        // Console.WriteLine("Hello");
        Insertmysql sq = new();
        // sq.getdata();
        // sq.EnterData(new Temp {Id="2",Email="V@gmail.com"});
        // sq.InsertBulk([new Temp {Id="3",Email="V@gmail.com"}, new Temp {Id="4",Email="V@gmail.com"}]);
    }
}
// public class Temp{
//     public string ? Id {get;set;}

//     public string ? Email {get;set;}
// }