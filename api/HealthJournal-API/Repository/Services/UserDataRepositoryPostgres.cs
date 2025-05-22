using HealthJournal_API.Models;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class UserDataRepositoryPostgres : IUserDataRepository
    {
        private readonly AppDbContext dbContext;
        private readonly AuthDbContext authContext;

        public UserDataRepositoryPostgres(AppDbContext context, AuthDbContext authContext)
        {
            this.dbContext = context;
            this.authContext = authContext;
        }

        public async Task DeleteUserDataAsync(string userId)
        {
            // Delete dailyNotes.
            var dailyNotes = dbContext.DailyNotes.Where(x => x.UserId == userId);
            dbContext.DailyNotes.RemoveRange(dailyNotes);

            // Delete NoteAttributes.
            var noteAttributes = dbContext.NoteAttributes.Where(x => x.UserId == userId);
            dbContext.NoteAttributes.RemoveRange(noteAttributes);

            // Delete NoteConfigurations.
            var noteConfigurations = dbContext.NoteConfigurations.Where(x => x.UserId == userId);
            dbContext.NoteConfigurations.RemoveRange(noteConfigurations);

            // Delete Notebooks.
            var notebooks = dbContext.Notebooks.Where(x => x.UserId == userId);
            dbContext.Notebooks.RemoveRange(notebooks);

            // Delete Pages.
            var pages = dbContext.Pages.Where(x => x.Notebook.UserId == userId);
            dbContext.Pages.RemoveRange(pages);

            // Delete PersonalAccessTokens.
            var personalAccessTokens = authContext.PersonalAccessTokens.Where(x => x.UserId == userId);
            authContext.PersonalAccessTokens.RemoveRange(personalAccessTokens);

            // Delete UserProfiles.
            var userProfile = await authContext.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userId);
            if (userProfile != null)
            {
                authContext.UserProfiles.Remove(userProfile);
            }

            await dbContext.SaveChangesAsync();
            await authContext.SaveChangesAsync();
        }
    }
}
