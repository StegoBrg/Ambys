using System.ComponentModel.DataAnnotations.Schema;

namespace HealthJournal_API.Models.Domain
{
    public class MedicationPlanEntry
    {
        public int Id { get; set; }
        public required string UserId { get; set; }

        public int MedicationId { get; set; }

        [ForeignKey(nameof(MedicationId))]
        public Medication Medication { get; set; } = null!;

        public string? Dosage { get; set; } // For example: "1 pill"
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; } // Only needed for temporary meds, e.g. antibiotics for 2 weeks.
        public bool IsActive => EndDate == null || EndDate >= DateOnly.FromDateTime(DateTime.Now); // If the end date is null or in the future, the medication is active.
        public bool IsAsNeeded { get; set; } // For example: "Take 1 pill as needed for pain." No schedule for those meds.
        public int? ScheduleId { get; set; }
        [ForeignKey(nameof(ScheduleId))]
        public MedicationSchedule? Schedule { get; set; } = null;
        public string? Notes { get; set; }
        public string? StoppedReason { get; set; } // Can be filled when the medication is stopped early for example because of side effects.
    }
}
