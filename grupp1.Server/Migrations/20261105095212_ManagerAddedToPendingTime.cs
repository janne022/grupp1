using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vicaria.Server.Migrations
{
    /// <inheritdoc />
    public partial class ManagerAddedToPendingTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ManagerId",
                table: "PendingTimes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_PendingTimes_ManagerId",
                table: "PendingTimes",
                column: "ManagerId");

            migrationBuilder.AddForeignKey(
                name: "FK_PendingTimes_AspNetUsers_ManagerId",
                table: "PendingTimes",
                column: "ManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PendingTimes_AspNetUsers_ManagerId",
                table: "PendingTimes");

            migrationBuilder.DropIndex(
                name: "IX_PendingTimes_ManagerId",
                table: "PendingTimes");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "PendingTimes");
        }
    }
}
