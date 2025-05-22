using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HealthJournal_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DailyNotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyNotes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Medications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Strength = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MedicationSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    TimesOfDay = table.Column<List<TimeOnly>>(type: "time without time zone[]", nullable: false),
                    DaysOfWeek = table.Column<int[]>(type: "integer[]", nullable: true),
                    IntervalDays = table.Column<int>(type: "integer", nullable: true),
                    IntervalWeeks = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationSchedules", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NoteAttributes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Element = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteAttributes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notebooks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notebooks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NoteConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteConfigurations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MedicationPlanEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    MedicationId = table.Column<int>(type: "integer", nullable: false),
                    Dosage = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IsAsNeeded = table.Column<bool>(type: "boolean", nullable: false),
                    ScheduleId = table.Column<int>(type: "integer", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    StoppedReason = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationPlanEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationPlanEntries_MedicationSchedules_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "MedicationSchedules",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MedicationPlanEntries_Medications_MedicationId",
                        column: x => x.MedicationId,
                        principalTable: "Medications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DailyNoteAttributes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Value = table.Column<string>(type: "text", nullable: false),
                    DailyNoteId = table.Column<int>(type: "integer", nullable: false),
                    NoteAttributeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyNoteAttributes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyNoteAttributes_DailyNotes_DailyNoteId",
                        column: x => x.DailyNoteId,
                        principalTable: "DailyNotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DailyNoteAttributes_NoteAttributes_NoteAttributeId",
                        column: x => x.NoteAttributeId,
                        principalTable: "NoteAttributes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true),
                    ParentId = table.Column<int>(type: "integer", nullable: true),
                    NotebookId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pages_Notebooks_NotebookId",
                        column: x => x.NotebookId,
                        principalTable: "Notebooks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pages_Pages_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NoteConfigurationAttributes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    NoteConfigurationId = table.Column<int>(type: "integer", nullable: false),
                    NoteAttributeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteConfigurationAttributes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoteConfigurationAttributes_NoteAttributes_NoteAttributeId",
                        column: x => x.NoteAttributeId,
                        principalTable: "NoteAttributes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NoteConfigurationAttributes_NoteConfigurations_NoteConfigur~",
                        column: x => x.NoteConfigurationId,
                        principalTable: "NoteConfigurations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyNoteAttributes_DailyNoteId",
                table: "DailyNoteAttributes",
                column: "DailyNoteId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyNoteAttributes_NoteAttributeId",
                table: "DailyNoteAttributes",
                column: "NoteAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyNotes_Date",
                table: "DailyNotes",
                column: "Date",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPlanEntries_MedicationId",
                table: "MedicationPlanEntries",
                column: "MedicationId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPlanEntries_ScheduleId",
                table: "MedicationPlanEntries",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_NoteConfigurationAttributes_NoteAttributeId",
                table: "NoteConfigurationAttributes",
                column: "NoteAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_NoteConfigurationAttributes_NoteConfigurationId",
                table: "NoteConfigurationAttributes",
                column: "NoteConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_Pages_NotebookId",
                table: "Pages",
                column: "NotebookId");

            migrationBuilder.CreateIndex(
                name: "IX_Pages_ParentId",
                table: "Pages",
                column: "ParentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyNoteAttributes");

            migrationBuilder.DropTable(
                name: "MedicationPlanEntries");

            migrationBuilder.DropTable(
                name: "NoteConfigurationAttributes");

            migrationBuilder.DropTable(
                name: "Pages");

            migrationBuilder.DropTable(
                name: "DailyNotes");

            migrationBuilder.DropTable(
                name: "MedicationSchedules");

            migrationBuilder.DropTable(
                name: "Medications");

            migrationBuilder.DropTable(
                name: "NoteAttributes");

            migrationBuilder.DropTable(
                name: "NoteConfigurations");

            migrationBuilder.DropTable(
                name: "Notebooks");
        }
    }
}
