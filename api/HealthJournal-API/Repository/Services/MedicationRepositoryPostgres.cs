using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class MedicationRepositoryPostgres : IMedicationRepository
    {
        // List of medications is not tied to a user.

        private readonly AppDbContext dbContext;

        public MedicationRepositoryPostgres(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<Medication>> GetAllMedicationAsync()
        {
            return await dbContext.Medications.ToListAsync();
        }

        public async Task<Medication?> GetMedicationAsync(int medicationId)
        {
            return await dbContext.Medications.FirstOrDefaultAsync(x => x.Id == medicationId);
        }

        public async Task<Medication> AddMedicationAsync(Medication medicationToAdd)
        {
            // Multiple entries with the same name are allowed because having different strength will result in multiple db entries.
            await dbContext.Medications.AddAsync(medicationToAdd);
            await dbContext.SaveChangesAsync();
            return medicationToAdd;
        }

        public async Task<Medication?> UpdateMedicationAsync(int medicationId, Medication updatedMedication)
        {
            var medicationToUpdate = await dbContext.Medications.FirstOrDefaultAsync(x => x.Id == medicationId);

            if (medicationToUpdate == null) return null;

            medicationToUpdate.Name = updatedMedication.Name;
            medicationToUpdate.Description = updatedMedication.Description;
            medicationToUpdate.Strength = updatedMedication.Strength;
            medicationToUpdate.Type = updatedMedication.Type;

            await dbContext.SaveChangesAsync();
            return medicationToUpdate;
        }

        public async Task<Medication?> DeleteMedicationAsync(int medicationId)
        {
            var medicationToDelete = await dbContext.Medications.FirstOrDefaultAsync(x => x.Id == medicationId);

            if (medicationToDelete == null) return null;

            dbContext.Medications.Remove(medicationToDelete);
            await dbContext.SaveChangesAsync();
            return medicationToDelete;
        }   
    }
}
