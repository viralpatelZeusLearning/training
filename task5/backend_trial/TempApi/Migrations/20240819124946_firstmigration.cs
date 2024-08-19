using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TempApi.Migrations
{
    /// <inheritdoc />
    public partial class firstmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MainModels",
                columns: table => new
                {
                    Email_Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    Sheet_Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: true),
                    Country = table.Column<string>(type: "longtext", nullable: true),
                    State = table.Column<string>(type: "longtext", nullable: true),
                    City = table.Column<string>(type: "longtext", nullable: true),
                    Telephone_no = table.Column<string>(type: "longtext", nullable: true),
                    Address_Line_1 = table.Column<string>(type: "longtext", nullable: true),
                    Address_Line_2 = table.Column<string>(type: "longtext", nullable: true),
                    Date_of_Birth = table.Column<DateOnly>(type: "date", nullable: true),
                    FY_2019_20 = table.Column<float>(type: "float", nullable: false),
                    FY_2020_21 = table.Column<float>(type: "float", nullable: false),
                    FY_2021_22 = table.Column<float>(type: "float", nullable: false),
                    FY_2022_23 = table.Column<float>(type: "float", nullable: false),
                    FY_2023_24 = table.Column<float>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MainModels", x => new { x.Sheet_Id, x.Email_Id });
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Status",
                columns: table => new
                {
                    fileId = table.Column<string>(type: "varchar(255)", nullable: false),
                    percentage = table.Column<float>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Status", x => x.fileId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Temps",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Temps", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MainModels");

            migrationBuilder.DropTable(
                name: "Status");

            migrationBuilder.DropTable(
                name: "Temps");
        }
    }
}
