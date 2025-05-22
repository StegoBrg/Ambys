using HealthJournal_API.Models.Domain;
using Microsoft.AspNetCore.Identity;

namespace HealthJournal_API.Repository.Interface
{
    public interface ITokenRepository
    {
        string CreateJwtToken(IdentityUser user, List<string> roles);

        Task<string> CreateRefreshTokenAsync(IdentityUser user);

        Task<RefreshToken?> GetRefreshTokenAsync(string token);

        Task<List<RefreshToken>> GetAllRefreshTokensForUserAsync(string userId);

        Task<RefreshToken?> RevokeRefreshTokenAsync(RefreshToken refreshToken);
    }
}
