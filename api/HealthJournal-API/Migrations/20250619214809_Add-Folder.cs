using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthJournal_API.Migrations
{
    /// <inheritdoc />
    public partial class AddFolder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Folder",
                table: "HealthReportConfigs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Folder",
                table: "HealthReportConfigs");
        }
    }
}
