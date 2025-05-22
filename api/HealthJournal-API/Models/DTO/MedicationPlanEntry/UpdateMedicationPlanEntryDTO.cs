using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Models.DTO.MedicationPlanEntry
{
    public class UpdateMedicationPlanEntryDTO
    {
        public DateOnly? EndDate { get; set; } // Only needed for temporary meds, e.g. antibiotics for 2 weeks.
        public string? Notes { get; set; }
        public string? StoppedReason { get; set; } // Can be filled when the medication is stopped early for example because of side effects.
    }
}
