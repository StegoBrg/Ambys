using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class NoteAttributeRepositoryPostgres : INoteAttributeRepository
    {
        private readonly AppDbContext dbContext;
        private readonly IUserContext userContext;

        public NoteAttributeRepositoryPostgres(AppDbContext dbContext, IUserContext userContext)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
        }

        public async Task<IEnumerable<NoteAttribute>> GetAllNoteAttributesAsync()
        {
            var userId = userContext.GetUserId();

            return await dbContext.NoteAttributes.Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task<NoteAttribute?> GetNoteAttributeAsync(int noteAttributeId)
        {
            var userId = userContext.GetUserId();

            return await dbContext.NoteAttributes.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == noteAttributeId);
        }

        public async Task<NoteAttribute?> AddNoteAttributeAsync(NoteAttribute noteAttributeToAdd)
        {
            var userId = userContext.GetUserId();
            if (userId == null) throw new UnauthorizedAccessException("This should never happen! If you see this error, please open a Github Issue.");
            noteAttributeToAdd.UserId = userId;

            // Check for already existing entry with the same name for the same user.
            var noteAttributeToAddModel = await dbContext.NoteAttributes.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Name == noteAttributeToAdd.Name);

            // Return null if entry exists because two entries with the same name are not allowed.
            if (noteAttributeToAddModel != null) return null;

            await dbContext.NoteAttributes.AddAsync(noteAttributeToAdd);
            await dbContext.SaveChangesAsync();
            return noteAttributeToAdd;
        }

        public async Task<NoteAttribute?> UpdateNoteAttributeAsync(int noteAttributeId, NoteAttribute updatedNoteAttribute)
        {
            var userId = userContext.GetUserId();

            var noteAttributeToUpdate = await dbContext.NoteAttributes.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == noteAttributeId);

            if (noteAttributeToUpdate == null) return null;

            noteAttributeToUpdate.Name = updatedNoteAttribute.Name;
            noteAttributeToUpdate.Element = updatedNoteAttribute.Element;

            await dbContext.SaveChangesAsync();
            return noteAttributeToUpdate;
        }

        public async Task<NoteAttribute?> DeleteNoteAttributeAsync(int noteAttributeId)
        {
            var userId = userContext.GetUserId();

            var noteAttributeToDelete = await dbContext.NoteAttributes.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == noteAttributeId);

            if (noteAttributeToDelete == null) return null;

            dbContext.NoteAttributes.Remove(noteAttributeToDelete);
            await dbContext.SaveChangesAsync();

            return noteAttributeToDelete;
        }
    }
}
