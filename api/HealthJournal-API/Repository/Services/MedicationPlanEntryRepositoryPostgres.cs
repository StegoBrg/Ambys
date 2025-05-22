using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class MedicationPlanEntryRepositoryPostgres : IMedicationPlanEntryRepository
    {
        private readonly AppDbContext dbContext;
        private readonly IUserContext userContext;

        public MedicationPlanEntryRepositoryPostgres(AppDbContext dbContext, IUserContext userContext)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
        }

        public async Task<IEnumerable<MedicationPlanEntry>> GetAllMedicationPlanEntriesAsync()
        {
            var userId = userContext.GetUserId();
            return await dbContext.MedicationPlanEntries.Include(x => x.Schedule).Include(x => x.Medication).Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task<MedicationPlanEntry?> GetMedicationPlanEntryAsync(int medicationPlanEntryId)
        {
            var userId = userContext.GetUserId();
            return await dbContext.MedicationPlanEntries.Include(x => x.Schedule).Include(x => x.Medication).Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == medicationPlanEntryId);
        }

        public async Task<IEnumerable<MedicationPlanEntry>> GetEntriesByDate(DateOnly date)
        {
            var allEntriesForDay = await dbContext.MedicationPlanEntries
                .Where(x => x.StartDate <= date && (x.EndDate == null || x.EndDate >= date))
                .Include(x => x.Schedule)
                .Include(x => x.Medication)
                .ToListAsync();

            // Filter according to schedule type.
            var filteredForDate = new List<MedicationPlanEntry>();
            foreach (var entry in allEntriesForDay)
            {
                if (ShouldIncludeEntry(entry, date)) filteredForDate.Add(entry);
            }

            return filteredForDate;
        }

        private bool ShouldIncludeEntry(MedicationPlanEntry entry, DateOnly date)
        {
            var schedule = entry.Schedule;

            if (schedule == null) return false;

            switch(schedule.Type)
            {
                case MedicationScheduleType.Daily:
                    return true;
                case MedicationScheduleType.CustomDays:
                    return schedule.DaysOfWeek != null && schedule.DaysOfWeek.Contains(date.DayOfWeek);
                case MedicationScheduleType.EveryXDays:
                    return (date.DayNumber - entry.StartDate.DayNumber) % schedule.IntervalDays == 0;
                case MedicationScheduleType.EveryXWeeks:
                    var weekInterval = (date.DayNumber - entry.StartDate.DayNumber) / 7;
                    return weekInterval > 0 && weekInterval % schedule.IntervalWeeks == 0;
                default:
                    return false;
            }
        }

        public async Task<MedicationPlanEntry> AddMedicationPlanEntryAsync(MedicationPlanEntry medicationPlanEntryToAdd)
        {
            var userId = userContext.GetUserId();
            if (userId == null) throw new UnauthorizedAccessException("This should never happen! If you see this error, please open a Github Issue.");
            medicationPlanEntryToAdd.UserId = userId;

            // Check if either isAsNeeded or schedule is set.
            if ((medicationPlanEntryToAdd.IsAsNeeded) == (medicationPlanEntryToAdd.Schedule != null))
            {
                throw new ArgumentException("Either isAsNeeded or schedule must be set.");
            }

            if(medicationPlanEntryToAdd.Schedule != null)
            {
                dbContext.MedicationSchedules.Add(medicationPlanEntryToAdd.Schedule);
            }

            dbContext.MedicationPlanEntries.Add(medicationPlanEntryToAdd);

            await dbContext.SaveChangesAsync();
            return medicationPlanEntryToAdd;
        }

        public async Task<MedicationPlanEntry?> UpdateMedicationPlanEntryAsync(int medicationPlanEntryId, MedicationPlanEntry updatedMedicationPlanEntry)
        {
            var userId = userContext.GetUserId();

            var medicationPlanEntryToUpdate = await dbContext.MedicationPlanEntries.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == medicationPlanEntryId);

            if (medicationPlanEntryToUpdate == null) return null;

            medicationPlanEntryToUpdate.EndDate = updatedMedicationPlanEntry.EndDate;
            medicationPlanEntryToUpdate.Notes = updatedMedicationPlanEntry.Notes;
            medicationPlanEntryToUpdate.StoppedReason = updatedMedicationPlanEntry.StoppedReason;

            await dbContext.SaveChangesAsync();
            return medicationPlanEntryToUpdate;
        }

        public async Task<MedicationPlanEntry?> DeleteMedicationPlanEntryAsync(int medicationPlanEntryId)
        {
            var userId = userContext.GetUserId();
            var medicationPlanEntryToDelete = await dbContext.MedicationPlanEntries.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == medicationPlanEntryId);

            if (medicationPlanEntryToDelete == null) return null;

            // If a schedule exists, delete it.
            if(medicationPlanEntryToDelete.Schedule != null) dbContext.MedicationSchedules.Remove(medicationPlanEntryToDelete.Schedule);

            dbContext.MedicationPlanEntries.Remove(medicationPlanEntryToDelete);
            
            await dbContext.SaveChangesAsync();
            return medicationPlanEntryToDelete;
        }
    }
}
