using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Repository.Interface
{
    public interface IMedicationPlanEntryRepository
    {
        Task<IEnumerable<MedicationPlanEntry>> GetAllMedicationPlanEntriesAsync();
        Task<MedicationPlanEntry?> GetMedicationPlanEntryAsync(int medicationPlanEntryId);
        Task<IEnumerable<MedicationPlanEntry>> GetEntriesByDate(DateOnly date);
        Task<MedicationPlanEntry> AddMedicationPlanEntryAsync(MedicationPlanEntry medicationPlanEntryToAdd);
        Task<MedicationPlanEntry?> UpdateMedicationPlanEntryAsync(int medicationPlanEntryId, MedicationPlanEntry updatedMedicationPlanEntry);
        Task<MedicationPlanEntry?> DeleteMedicationPlanEntryAsync(int medicationPlanEntryId);
    }
}
