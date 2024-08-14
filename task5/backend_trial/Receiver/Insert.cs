using tempdb.Model;
using System.Text;
using MySql.Data.MySqlClient;


namespace Sqltrial;

public class Insertmysql {

    public readonly MySqlConnection conn;
    public  Insertmysql()
    {
        string myconnection = "server=localhost;user=root;password=root;database=temp";
        conn = new MySql.Data.MySqlClient.MySqlConnection();
        conn.ConnectionString = myconnection;
        conn.Open();
    }
    // public void getdata()
    // {
    //     // System.Data.DataTable data = conn.GetSchema("MetaDataCollections");   
    //     // Console.WriteLine(data);
    //     string sql = "select * from temps";
    //     MySqlCommand cmd = new MySqlCommand(sql,conn);
    //     MySqlDataReader rdr = cmd.ExecuteReader();
    //     //rdr.FileCount()
    //     while (rdr.Read()){
    //         Console.WriteLine(rdr[0]);
    //     }
    //     rdr.Close();
    // }
    // public void EnterData(Temp o)
    // {
    //     // var obj = new {Id="1",Email="V@gmail.com"};
    //     string Insertval = $"insert into temps (Id , Email) values('{o.Id}','{o.Email}') as val on duplicate key update Email = val.Email;";
    //     MySqlCommand cmd = new MySqlCommand(Insertval,conn);
    //     cmd.ExecuteNonQuery();
    // }
    public void InsertBulk(List<Temp> DataList)
    {
        string Bulkinsert1 = $"insert into temps (Id , Email) values";
        var Bulkinsert2 = new StringBuilder();
        string Bulkinsert3 = " as val on duplicate key update Email = val.Email;";
        foreach (var item in DataList)
        {
            Bulkinsert2.Append($"('{item.Id}','{item.Email}'),");
        }
        Bulkinsert2.Remove(Bulkinsert2.Length-1,1);
        string Bulkinsert = Bulkinsert1 + Bulkinsert2 + Bulkinsert3;
        // Console.WriteLine(Bulkinsert);
        MySqlCommand cmd = new MySqlCommand(Bulkinsert,conn);
        cmd.ExecuteNonQuery();
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