using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO;

namespace HealthJournal_API.Repository.Interface
{
    public interface IDailyNoteRepository
    {
        Task<IEnumerable<DailyNote>> GetAllDailyNotesAsync(DateOnly? startDate = null, DateOnly? endDate = null);
        Task<DailyNote?> GetDailyNoteAsync(int dailyNoteId);
        Task<DailyNote?> AddDailyNoteAsync(DailyNote dailyNoteToAdd);
        Task<DailyNote?> UpdateDailyNoteAsync(int dailyNoteId, DailyNote updatedDailyNote);
        Task<DailyNote?> DeleteDailyNoteAsync(int dailyNoteId);
    }
}
