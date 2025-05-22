using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class NoteConfigurationRepositoryPostgres : INoteConfigurationRepository
    {
        private readonly AppDbContext dbContext;
        private readonly IUserContext userContext;

        public NoteConfigurationRepositoryPostgres(AppDbContext dbContext, IUserContext userContext)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
        }

        public async Task<IEnumerable<NoteConfiguration>> GetAllNoteConfigurationsAsync()
        {
            var userId = userContext.GetUserId();

            return await dbContext.NoteConfigurations.Include(nc => nc.NoteAttributes).ThenInclude(nca => nca.NoteAttribute).Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task<NoteConfiguration?> GetNoteConfigurationAsync(int noteConfigurationId)
        {
            var userId = userContext.GetUserId();

            return await dbContext.NoteConfigurations.Include(d => d.NoteAttributes).ThenInclude(nca => nca.NoteAttribute).Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == noteConfigurationId);
        }

        public async Task<NoteConfiguration?> AddNoteConfigurationAsync(NoteConfiguration noteConfigurationToAdd)
        {
            var userId = userContext.GetUserId();
            if (userId == null) throw new UnauthorizedAccessException("This should never happen! If you see this error, please open a Github Issue.");
            noteConfigurationToAdd.UserId = userId;

            // Ensure that only one noteConfiguration per user exists.
            var noteConfigurationToAddModel = await dbContext.NoteConfigurations.FirstOrDefaultAsync(x => x.UserId == userId);
            if (noteConfigurationToAddModel != null) return null;

            await dbContext.NoteConfigurations.AddAsync(noteConfigurationToAdd);

            if(noteConfigurationToAdd.NoteAttributes != null && noteConfigurationToAdd.NoteAttributes.Count > 0)
            {
                int order = 1;
                foreach(var attribute in noteConfigurationToAdd.NoteAttributes)
                {
                    attribute.Order = order;
                    order++;
                }
            }


            await dbContext.SaveChangesAsync();
            return noteConfigurationToAdd;
        }

        public async Task<NoteConfiguration?> UpdateNoteConfigurationAsync(int noteConfigurationId, NoteConfiguration updatedConfiguration)
        {
            var userId = userContext.GetUserId();
            if (userId == null) throw new UnauthorizedAccessException("This should never happen! If you see this error, please open a Github Issue.");

            var noteConfigurationToUpdate = await dbContext.NoteConfigurations.Include(d => d.NoteAttributes).ThenInclude(a => a.NoteAttribute).Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == noteConfigurationId);

            if (noteConfigurationToUpdate == null) return null;

            // Get all noteAttributes from noteConfigurationToUpdate which are not located in updatedConfiguration
            // Get all ids from updatedConfiguration
            List<int> updatedConfigIds = new List<int>();
            updatedConfiguration.NoteAttributes.ForEach(x => updatedConfigIds.Add(x.Id));
            var noteAttributesToRemove = noteConfigurationToUpdate.NoteAttributes.FindAll(x => !updatedConfigIds.Contains(x.NoteAttributeId));

            noteConfigurationToUpdate.NoteAttributes.RemoveAll(x => noteAttributesToRemove.Contains(x));

            
            int order = 1;
            foreach (var attribute in updatedConfiguration.NoteAttributes)
            {
                attribute.Order = order;
                attribute.NoteAttribute.UserId = userId; // Set the UserId for the NoteAttribute to the current user
                order++;

                // Check if NoteAttribute already exists, if no then add a new one, if yes just skip, because note attributes cannot be changed, only added or removed.
                var existingAttribute = noteConfigurationToUpdate.NoteAttributes.FirstOrDefault(a => a.NoteAttribute.Id == attribute.NoteAttribute.Id);
                if (existingAttribute == null)
                {
                    noteConfigurationToUpdate.NoteAttributes.Add(new NoteConfigurationAttribute
                    {
                        NoteAttribute = attribute.NoteAttribute,
                        NoteAttributeId = attribute.NoteAttribute.Id,
                        NoteConfiguration = noteConfigurationToUpdate,
                        NoteConfigurationId = noteConfigurationId,
                        Order = order
                    });
                }
                else
                {
                    // Just change the order to the existing attribute.
                    existingAttribute.Order = order;
                }
            }
                        
            await dbContext.SaveChangesAsync(); 

            return noteConfigurationToUpdate;
        }

        public async Task<NoteConfiguration?> DeleteNoteConfigurationAsync(int noteConfigurationId)
        {
            var userId = userContext.GetUserId();

            var noteConfigurationToDelete = await dbContext.NoteConfigurations.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == noteConfigurationId);

            if (noteConfigurationToDelete == null) return null;

            dbContext.NoteConfigurations.Remove(noteConfigurationToDelete);
            await dbContext.SaveChangesAsync();

            return noteConfigurationToDelete;
        }
    }
}
