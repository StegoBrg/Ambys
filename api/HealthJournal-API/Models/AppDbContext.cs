using HealthJournal_API.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {            
        }

        public DbSet<DailyNote> DailyNotes { get; set; }
        public DbSet<DailyNoteAttribute> DailyNoteAttributes { get; set; }
        public DbSet<NoteAttribute> NoteAttributes { get; set; }
        public DbSet<NoteConfiguration> NoteConfigurations { get; set; }
        public DbSet<NoteConfigurationAttribute> NoteConfigurationAttributes { get; set; }
        public DbSet<Notebook> Notebooks { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<MedicationPlanEntry> MedicationPlanEntries { get; set; }
        public DbSet<MedicationSchedule> MedicationSchedules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Page>()
                .HasOne(p => p.Notebook)
                .WithMany(n => n.Pages)
                .HasForeignKey(p => p.NotebookId)
                .OnDelete(DeleteBehavior.Cascade); // Delete Pages when Notebook is deleted

            modelBuilder.Entity<Page>()
                .HasOne(p => p.Parent)
                .WithMany(p => p.Subpages)
                .HasForeignKey(p => p.ParentId)
                .OnDelete(DeleteBehavior.Cascade); // Delete Subpages when Parent Page is deleted
        }
    }
}
