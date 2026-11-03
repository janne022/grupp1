using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vicaria.Server.Migrations
{
    /// <inheritdoc />
    public partial class PendingTimeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PendingTimes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsBooked = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PendingTimes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserPendingTimes",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PendingTimeId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPendingTimes", x => new { x.UserId, x.PendingTimeId });
                    table.ForeignKey(
                        name: "FK_UserPendingTimes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPendingTimes_PendingTimes_PendingTimeId",
                        column: x => x.PendingTimeId,
                        principalTable: "PendingTimes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserPendingTimes_PendingTimeId",
                table: "UserPendingTimes",
                column: "PendingTimeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserPendingTimes");

            migrationBuilder.DropTable(
                name: "PendingTimes");
        }
    }
}
