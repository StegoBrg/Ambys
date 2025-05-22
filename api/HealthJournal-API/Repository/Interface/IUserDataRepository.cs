namespace HealthJournal_API.Repository.Interface
{
    public interface IUserDataRepository
    {
        Task DeleteUserDataAsync(string userId);
    }
}
