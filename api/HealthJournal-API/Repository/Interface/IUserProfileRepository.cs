using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Repository.Interface
{
    public interface IUserProfileRepository
    {
        Task<UserProfile?> GetUserProfileAsync(string userId);
        Task<UserProfile?> AddUserProfileAsync(UserProfile userProfileToAdd);
        Task<UserProfile?> UpdateUserProfileAsync(string userId, UserProfile updatedUserProfile);
        Task<UserProfile?> DeleteUserProfileAsync(string userId);
    }
}
