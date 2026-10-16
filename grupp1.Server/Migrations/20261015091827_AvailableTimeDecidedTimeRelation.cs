using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grupp1.Server.Migrations
{
    /// <inheritdoc />
    public partial class AvailableTimeDecidedTimeRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AvailableTimeId",
                table: "DecidedTimes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_DecidedTimes_AvailableTimeId",
                table: "DecidedTimes",
                column: "AvailableTimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_DecidedTimes_AvailableTimes_AvailableTimeId",
                table: "DecidedTimes",
                column: "AvailableTimeId",
                principalTable: "AvailableTimes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DecidedTimes_AvailableTimes_AvailableTimeId",
                table: "DecidedTimes");

            migrationBuilder.DropIndex(
                name: "IX_DecidedTimes_AvailableTimeId",
                table: "DecidedTimes");

            migrationBuilder.DropColumn(
                name: "AvailableTimeId",
                table: "DecidedTimes");
        }
    }
}
