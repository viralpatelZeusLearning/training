using tempdb.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using MongoDB.Driver;
var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

builder.Services.AddControllers();
//mongodb connection
builder.Services.AddSingleton<IMongoClient>(service =>{
    var connect = builder.Configuration.GetConnectionString("MongoContext");
    return new MongoClient(connect);
});
//sql connection
builder.Services.AddDbContext<TempContext>(opt =>
    opt.UseMySQL(builder.Configuration.GetConnectionString("TempContext")));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(),"../../frontend_excel")),
    RequestPath = "/frontend"
});

app.UseAuthorization();

app.MapControllers();

app.Run();
