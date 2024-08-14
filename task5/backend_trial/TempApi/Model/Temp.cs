using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace tempdb.Model;

public partial class Temp
{
    // [Key]
    public string? Id { get; set; }

    public string? Email { get; set; }
}
