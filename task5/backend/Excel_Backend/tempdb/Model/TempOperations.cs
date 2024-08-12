using tempdb.Model;
class TempOperations{
    TempContext db;
    public TempOperations(){
        db = new TempContext();
    }
    public List<Temp> ReadRow(){
        return db.Temps.ToList();
    }
    public void CreateRow(Temp o){
        db.Add(o);
        db.SaveChanges();
    }
    // public UpdateRow(){

    // }
    // public DeleteRow(){

    // }
}
