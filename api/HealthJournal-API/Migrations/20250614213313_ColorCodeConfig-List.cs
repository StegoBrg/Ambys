using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HealthJournal_API.Migrations
{
    /// <inheritdoc />
    public partial class ColorCodeConfigList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HealthReportConfigs_Clauses");

            migrationBuilder.DropColumn(
                name: "ColorCodeConfig_ColorHex",
                table: "HealthReportConfigs");

            migrationBuilder.DropColumn(
                name: "ColorCodeConfig_LogicGate",
                table: "HealthReportConfigs");

            migrationBuilder.CreateTable(
                name: "ColorCodeConfiguration",
                columns: table => new
                {
                    HealthReportConfigId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LogicGate = table.Column<int>(type: "integer", nullable: false),
                    ColorHex = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColorCodeConfiguration", x => new { x.HealthReportConfigId, x.Id });
                    table.ForeignKey(
                        name: "FK_ColorCodeConfiguration_HealthReportConfigs_HealthReportConf~",
                        column: x => x.HealthReportConfigId,
                        principalTable: "HealthReportConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ColorCodeConfiguration_Clauses",
                columns: table => new
                {
                    ColorCodeConfigurationHealthReportConfigId = table.Column<int>(type: "integer", nullable: false),
                    ColorCodeConfigurationId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Element = table.Column<string>(type: "text", nullable: false),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColorCodeConfiguration_Clauses", x => new { x.ColorCodeConfigurationHealthReportConfigId, x.ColorCodeConfigurationId, x.Id });
                    table.ForeignKey(
                        name: "FK_ColorCodeConfiguration_Clauses_ColorCodeConfiguration_Color~",
                        columns: x => new { x.ColorCodeConfigurationHealthReportConfigId, x.ColorCodeConfigurationId },
                        principalTable: "ColorCodeConfiguration",
                        principalColumns: new[] { "HealthReportConfigId", "Id" },
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ColorCodeConfiguration_Clauses");

            migrationBuilder.DropTable(
                name: "ColorCodeConfiguration");

            migrationBuilder.AddColumn<string>(
                name: "ColorCodeConfig_ColorHex",
                table: "HealthReportConfigs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ColorCodeConfig_LogicGate",
                table: "HealthReportConfigs",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "HealthReportConfigs_Clauses",
                columns: table => new
                {
                    ColorCodeConfigurationHealthReportConfigId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Element = table.Column<string>(type: "text", nullable: false),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthReportConfigs_Clauses", x => new { x.ColorCodeConfigurationHealthReportConfigId, x.Id });
                    table.ForeignKey(
                        name: "FK_HealthReportConfigs_Clauses_HealthReportConfigs_ColorCodeCo~",
                        column: x => x.ColorCodeConfigurationHealthReportConfigId,
                        principalTable: "HealthReportConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
