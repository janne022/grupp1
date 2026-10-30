using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vicaria.Server.Migrations
{
    /// <inheritdoc />
    public partial class PendingTimeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "PendingTimes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "KindergartenId",
                table: "PendingTimes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartTime",
                table: "PendingTimes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_PendingTimes_KindergartenId",
                table: "PendingTimes",
                column: "KindergartenId");

            migrationBuilder.AddForeignKey(
                name: "FK_PendingTimes_Kindergartens_KindergartenId",
                table: "PendingTimes",
                column: "KindergartenId",
                principalTable: "Kindergartens",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PendingTimes_Kindergartens_KindergartenId",
                table: "PendingTimes");

            migrationBuilder.DropIndex(
                name: "IX_PendingTimes_KindergartenId",
                table: "PendingTimes");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "PendingTimes");

            migrationBuilder.DropColumn(
                name: "KindergartenId",
                table: "PendingTimes");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "PendingTimes");
        }
    }
}
