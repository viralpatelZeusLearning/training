using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace tempdb.Model;

public partial class MainModel
{
    [Key]
    [RegularExpression (@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")]
    public string? Email_Id { get; set; }

    public string? Name { get; set; }
    public string? Country { get; set; }
    public string? State { get; set; }
    public string? City { get; set; }
    public string? Telephone_no { get; set; }
    public string? Address_Line_1 { get; set; }
    public string? Address_Line_2 { get; set; }
    public DateOnly? Date_of_Birth { get; set; }
    public float FY_2019_20 { get; set; }
    public float FY_2020_21 { get; set; }
    public float FY_2021_22 { get; set; }
    public float FY_2022_23 { get; set; }
    public float FY_2023_24 { get; set; }
}
