using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class DailyNoteRepositoryPostgres : IDailyNoteRepository
    {
        private readonly AppDbContext dbContext;
        private readonly IUserContext userContext;

        public DailyNoteRepositoryPostgres(AppDbContext dbContext, IUserContext userContext)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
        }

        public async Task<IEnumerable<DailyNote>> GetAllDailyNotesAsync(DateOnly? startDate, DateOnly? endDate)
        {
            var userId = userContext.GetUserId();

            var dailyNotes = await dbContext.DailyNotes.Include(d => d.Attributes).ThenInclude(a => a.NoteAttribute).Where(x => x.UserId == userId).ToListAsync();

            dailyNotes = dailyNotes.Where(note => (startDate == null || note.Date.CompareTo(startDate) >= 0) && (endDate == null || note.Date.CompareTo(endDate) <= 0)).ToList();
            return dailyNotes;
        }

        public async Task<DailyNote?> GetDailyNoteAsync(int dailyNoteId)
        {
            var userId = userContext.GetUserId();

            return await dbContext.DailyNotes.Include(d => d.Attributes).ThenInclude(a => a.NoteAttribute).Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == dailyNoteId);
        }

        public async Task<DailyNote?> AddDailyNoteAsync(DailyNote dailyNoteToAdd)
        {
            // Add userID to daily note.
            var userId = userContext.GetUserId();
            if (userId == null) throw new UnauthorizedAccessException("This should never happen! If you see this error, please open a Github Issue.");
            dailyNoteToAdd.UserId = userId;

            // Check for already existing entry with the same date for the same user.
            var dailyNoteToAddModel = await dbContext.DailyNotes.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Date == dailyNoteToAdd.Date);

            // Return null if entry exists because two entries with the same date are not allowed.
            if (dailyNoteToAddModel != null) return null;

            foreach (var attribute in dailyNoteToAdd.Attributes)
            {
                // Check if note attribute exists.
                var existingAttribute = await dbContext.NoteAttributes
                    .FirstOrDefaultAsync(na => na.Name == attribute.NoteAttribute.Name);

                // Only continue if note attribute exists, otherwise return null,
                if (existingAttribute != null)
                {
                    attribute.NoteAttribute = existingAttribute;
                }        
                // TODO: Handle case if attribute does not exist. It should not happen in combination with the frontend but will be needed if api is used seperately.
            }

            await dbContext.DailyNotes.AddAsync(dailyNoteToAdd);
            await dbContext.SaveChangesAsync();
            return dailyNoteToAdd;
        }

        public async Task<DailyNote?> UpdateDailyNoteAsync(int dailyNoteId, DailyNote updatedDailyNote)
        {
            var userId = userContext.GetUserId();

            // It is only possible to alter the value of already exisiting attributes but not alter attributes.
            var dailyNoteToUpdate = await dbContext.DailyNotes.Include(d => d.Attributes).ThenInclude(a => a.NoteAttribute).Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == dailyNoteId);

            if (dailyNoteToUpdate == null) return null;

            // Update the date.
            dailyNoteToUpdate.Date = updatedDailyNote.Date;

            foreach(var attribute in updatedDailyNote.Attributes)
            {
                var existingAttribute = dailyNoteToUpdate.Attributes.FirstOrDefault(a => a.NoteAttribute.Name == attribute.NoteAttribute.Name);

                // If attribute already exists.
                if (existingAttribute != null)
                { 
                    existingAttribute.Value = attribute.Value;
                }
                else
                {   
                    // Get noteattribute from database.
                    var noteAttribute = await dbContext.NoteAttributes.FirstOrDefaultAsync(x => x.Name == attribute.NoteAttribute.Name);

                    if(noteAttribute == null) return null; // If note attribute does not exist, return null. TODO: Return clear error message.
                    dailyNoteToUpdate.Attributes.Add(new DailyNoteAttribute
                    {
                        Id = 0,
                        NoteAttribute = noteAttribute,
                        Value = attribute.Value,
                    });                  
                }
            }

            await dbContext.SaveChangesAsync();
            return dailyNoteToUpdate;
        }

        public async Task<DailyNote?> DeleteDailyNoteAsync(int dailyNoteId)
        {
            var userId = userContext.GetUserId();

            var dailyNoteToDelete = await dbContext.DailyNotes.Include(d => d.Attributes).ThenInclude(a => a.NoteAttribute).Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == dailyNoteId);

            if (dailyNoteToDelete == null) return null;

            dbContext.DailyNotes.Remove(dailyNoteToDelete);
            await dbContext.SaveChangesAsync();

            return dailyNoteToDelete;
        }  
    }
}
