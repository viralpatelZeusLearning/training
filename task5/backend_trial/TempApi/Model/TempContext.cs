using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Status.model;

namespace tempdb.Model;

public partial class TempContext : DbContext
{
    public TempContext()
    {
    }

    public TempContext(DbContextOptions<TempContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Temp> Temps { get; set; }
    public virtual DbSet<MainModel> MainModels {get;set;}
    public virtual DbSet<StatusClass> Status {get;set;}
//     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
// #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//         => optionsBuilder.UseMySQL("server=localhost;database=temp;user=root;password=root");

//     protected override void OnModelCreating(ModelBuilder modelBuilder)
//     {
//         modelBuilder.Entity<Temp>(entity =>
//         {
//             entity.HasKey(e => e.Id).HasName("PRIMARY");

//             entity.ToTable("temp");

//             entity.Property(e => e.Id).HasColumnName("id");
//             entity.Property(e => e.Email)
//                 .HasMaxLength(45)
//                 .HasColumnName("email");
//         });

//         OnModelCreatingPartial(modelBuilder);
//     }

//     partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
