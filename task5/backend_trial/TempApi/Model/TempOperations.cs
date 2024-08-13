using tempdb.Model;

namespace TempOperations_namespace{
    public class TempOperations{
        TempContext db;
        public TempOperations(){
            db = new TempContext();
        }
        public List<Temp> ReadRow(){
            return db.Temps.ToList();
        }
        public void CreateRow(Temp o){
            if (db.Temps.Find(o.Id) == null){

                db.Add(o);
                db.SaveChanges();
            }
            else{
                Console.WriteLine("Already Exist");
            }
        }
        // public UpdateRow(){

        // }
        // public DeleteRow(){

        // }
    }

}
