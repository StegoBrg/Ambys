using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class UserProfileRepositoryPostgres : IUserProfileRepository
    {
        private readonly AuthDbContext context;

        public UserProfileRepositoryPostgres(AuthDbContext context)
        {
            this.context = context;
        }

        public async Task<UserProfile?> GetUserProfileAsync(string userId)
        {
            return await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<UserProfile?> AddUserProfileAsync(UserProfile userProfileToAdd)
        {
            var alreadyExistingUserProfile = await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userProfileToAdd.UserId);

            if (alreadyExistingUserProfile != null) return null;

            await context.UserProfiles.AddAsync(userProfileToAdd);
            await context.SaveChangesAsync();

            return userProfileToAdd;
        }

        public async Task<UserProfile?> UpdateUserProfileAsync(string userId, UserProfile updatedUserProfile)
        {
            var userProfileToUpdate = await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userId);

            if (userProfileToUpdate == null) return null;

            // Update the user profiles properties.
            userProfileToUpdate.FullName = updatedUserProfile.FullName;

            await context.SaveChangesAsync();
            return userProfileToUpdate;
        }

        public async Task<UserProfile?> DeleteUserProfileAsync(string userId)
        {
            var userProfileToDelete = await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userId);

            if (userProfileToDelete == null) return null;

            context.UserProfiles.Remove(userProfileToDelete);
            await context.SaveChangesAsync();

            return userProfileToDelete;
        }
    }
}
