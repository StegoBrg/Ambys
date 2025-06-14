using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HealthJournal_API.Migrations
{
    /// <inheritdoc />
    public partial class AddHealthReportConfigs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HealthReportConfigs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ColorCodeConfig_LogicGate = table.Column<int>(type: "integer", nullable: true),
                    ColorCodeConfig_ColorHex = table.Column<string>(type: "text", nullable: true),
                    IncludeMedicationList = table.Column<bool>(type: "boolean", nullable: false),
                    AdditionalNotes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthReportConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AttributeVisualization",
                columns: table => new
                {
                    HealthReportConfigId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AttributeName = table.Column<string>(type: "text", nullable: false),
                    VisualizationType = table.Column<int>(type: "integer", nullable: false),
                    Filter_LogicGate = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttributeVisualization", x => new { x.HealthReportConfigId, x.Id });
                    table.ForeignKey(
                        name: "FK_AttributeVisualization_HealthReportConfigs_HealthReportConf~",
                        column: x => x.HealthReportConfigId,
                        principalTable: "HealthReportConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "AttributeVisualization_Clauses",
                columns: table => new
                {
                    DiaryFilterConfigurationAttributeVisualizationHealthReportConf = table.Column<int>(name: "DiaryFilterConfigurationAttributeVisualizationHealthReportConf~", type: "integer", nullable: false),
                    DiaryFilterConfigurationAttributeVisualizationId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Element = table.Column<string>(type: "text", nullable: false),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttributeVisualization_Clauses", x => new { x.DiaryFilterConfigurationAttributeVisualizationHealthReportConf, x.DiaryFilterConfigurationAttributeVisualizationId, x.Id });
                    table.ForeignKey(
                        name: "FK_AttributeVisualization_Clauses_AttributeVisualization_Diary~",
                        columns: x => new { x.DiaryFilterConfigurationAttributeVisualizationHealthReportConf, x.DiaryFilterConfigurationAttributeVisualizationId },
                        principalTable: "AttributeVisualization",
                        principalColumns: new[] { "HealthReportConfigId", "Id" },
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttributeVisualization_Clauses");

            migrationBuilder.DropTable(
                name: "HealthReportConfigs_Clauses");

            migrationBuilder.DropTable(
                name: "AttributeVisualization");

            migrationBuilder.DropTable(
                name: "HealthReportConfigs");
        }
    }
}
