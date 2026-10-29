using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Vicaria.Server.Migrations
{
    /// <inheritdoc />
    public partial class SubstituteManagerRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("03dbc570-7db4-4dcc-a50e-017f41dd9804"), "ManagerRole", "Manager", "MANAGER" },
                    { new Guid("4afc3864-9194-4417-80df-e4d78a161e71"), "SubstituteRole", "Substitute", "SUBSTITUTE" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("03dbc570-7db4-4dcc-a50e-017f41dd9804"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("4afc3864-9194-4417-80df-e4d78a161e71"));
        }
    }
}
