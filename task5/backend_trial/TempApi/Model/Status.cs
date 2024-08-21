using System.ComponentModel.DataAnnotations;
using tempdb.Model;

namespace Status.model;

public partial class StatusClass{
    [Key]
    public string ? fileId {get;set;}

    public double percentage {get;set;} = 0;
}
