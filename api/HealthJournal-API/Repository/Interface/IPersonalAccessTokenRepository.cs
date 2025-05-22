using HealthJournal_API.Models.Domain;
using Microsoft.AspNetCore.Identity;

namespace HealthJournal_API.Repository.Interface
{
    public interface IPersonalAccessTokenRepository
    {
        Task<List<PersonalAccessToken>> GetPersonalAccessTokensAsync();
        Task<string?> CreatePersonalAccessTokenAsync(IdentityUser user, string name, List<string> roles);
        Task<PersonalAccessToken?> DeletePersonalAccessTokenAsync(int id);
    }
}
