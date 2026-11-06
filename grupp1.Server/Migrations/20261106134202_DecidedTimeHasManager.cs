using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vicaria.Server.Migrations
{
    /// <inheritdoc />
    public partial class DecidedTimeHasManager : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DecidedTimes_AspNetUsers_UserId",
                table: "DecidedTimes");

            migrationBuilder.DropForeignKey(
                name: "FK_DecidedTimes_AvailableTimes_AvailableTimeId",
                table: "DecidedTimes");

            migrationBuilder.DropIndex(
                name: "IX_DecidedTimes_AvailableTimeId",
                table: "DecidedTimes");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "DecidedTimes",
                newName: "SubstituteId");

            migrationBuilder.RenameColumn(
                name: "AvailableTimeId",
                table: "DecidedTimes",
                newName: "PendingTimeId");

            migrationBuilder.RenameIndex(
                name: "IX_DecidedTimes_UserId",
                table: "DecidedTimes",
                newName: "IX_DecidedTimes_SubstituteId");

            migrationBuilder.AddColumn<Guid>(
                name: "ManagerId",
                table: "DecidedTimes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_DecidedTimes_ManagerId",
                table: "DecidedTimes",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_DecidedTimes_PendingTimeId",
                table: "DecidedTimes",
                column: "PendingTimeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DecidedTimes_AspNetUsers_ManagerId",
                table: "DecidedTimes",
                column: "ManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DecidedTimes_AspNetUsers_SubstituteId",
                table: "DecidedTimes",
                column: "SubstituteId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DecidedTimes_PendingTimes_PendingTimeId",
                table: "DecidedTimes",
                column: "PendingTimeId",
                principalTable: "PendingTimes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DecidedTimes_AspNetUsers_ManagerId",
                table: "DecidedTimes");

            migrationBuilder.DropForeignKey(
                name: "FK_DecidedTimes_AspNetUsers_SubstituteId",
                table: "DecidedTimes");

            migrationBuilder.DropForeignKey(
                name: "FK_DecidedTimes_PendingTimes_PendingTimeId",
                table: "DecidedTimes");

            migrationBuilder.DropIndex(
                name: "IX_DecidedTimes_ManagerId",
                table: "DecidedTimes");

            migrationBuilder.DropIndex(
                name: "IX_DecidedTimes_PendingTimeId",
                table: "DecidedTimes");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "DecidedTimes");

            migrationBuilder.RenameColumn(
                name: "SubstituteId",
                table: "DecidedTimes",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "PendingTimeId",
                table: "DecidedTimes",
                newName: "AvailableTimeId");

            migrationBuilder.RenameIndex(
                name: "IX_DecidedTimes_SubstituteId",
                table: "DecidedTimes",
                newName: "IX_DecidedTimes_UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DecidedTimes_AvailableTimeId",
                table: "DecidedTimes",
                column: "AvailableTimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_DecidedTimes_AspNetUsers_UserId",
                table: "DecidedTimes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DecidedTimes_AvailableTimes_AvailableTimeId",
                table: "DecidedTimes",
                column: "AvailableTimeId",
                principalTable: "AvailableTimes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
