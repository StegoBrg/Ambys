using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Repository.Interface
{
    public interface IMedicationRepository
    {
        Task<IEnumerable<Medication>> GetAllMedicationAsync();
        Task<Medication?> GetMedicationAsync(int medicationId);
        Task<Medication> AddMedicationAsync(Medication medicationToAdd);
        Task<Medication?> UpdateMedicationAsync(int medicationId, Medication updatedMedication);
        Task<Medication?> DeleteMedicationAsync(int medicationId);
    }
}
