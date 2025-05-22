using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace HealthJournal_API.Repository.Services
{
    public class PersonalAccessTokenRepositoryPostgres : IPersonalAccessTokenRepository
    {
        private readonly AuthDbContext context;
        private readonly IUserContext userContext;

        public PersonalAccessTokenRepositoryPostgres(AuthDbContext context, IUserContext userContext)
        {
            this.context = context;
            this.userContext = userContext;
        }

        public async Task<List<PersonalAccessToken>> GetPersonalAccessTokensAsync()
        {
            var userId = userContext.GetUserId();

            return await context.PersonalAccessTokens.Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task<string?> CreatePersonalAccessTokenAsync(IdentityUser user, string name, List<string> roles)
        {
            var userId = userContext.GetUserId();

            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            // Make sure the token name is unique for each user.
            var existingToken = await context.PersonalAccessTokens.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Name == name);
            if (existingToken != null) return null;

            // Hash the token before storing it
            using var sha256 = SHA256.Create();
            var tokenHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(token)));

            var pat = new PersonalAccessToken
            {
                Name = name,
                TokenHashed = tokenHash,
                UserId = user.Id,
                Roles = roles,
                CreatedAt = DateTime.UtcNow,
                User = user
            };

            context.PersonalAccessTokens.Add(pat);
            await context.SaveChangesAsync();

            return token; // Return the plain token (hashed version is stored).
        }

        public async Task<PersonalAccessToken?> DeletePersonalAccessTokenAsync(int id)
        {
            var userId = userContext.GetUserId();

            var pat = await context.PersonalAccessTokens.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == id);

            if (pat == null) return null;

            context.PersonalAccessTokens.Remove(pat);
            await context.SaveChangesAsync();

            return pat;
        }
    }
}
