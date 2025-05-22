using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO.Medication;

namespace HealthJournal_API.Models.DTO.MedicationPlanEntry
{
    public class AddMedicationPlanEntryDTO
    {
        public int MedicationId { get; set; }
        public string? Dosage { get; set; } // For example: "1 pill"
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; } // Only needed for temporary meds, e.g. antibiotics for 2 weeks.
        public bool IsAsNeeded { get; set; } // For example: "Take 1 pill as needed for pain." No schedule for those meds.
        public MedicationSchedule? Schedule { get; set; } = null;
        public string? Notes { get; set; }
        public string? StoppedReason { get; set; } // Can be filled when the medication is stopped early for example because of side effects.
    }
}
