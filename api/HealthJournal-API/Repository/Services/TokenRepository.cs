using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace HealthJournal_API.Repository.Services
{
    public class TokenRepository : ITokenRepository
    {
        private readonly AuthDbContext context;
        private readonly IConfiguration configuration;

        public TokenRepository(AuthDbContext context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }

        public string CreateJwtToken(IdentityUser user, List<string> roles)
        {
            // Make sure all Jwt settings are set.
            var issuer = configuration["Jwt:Issuer"];
            var audience = configuration["Jwt:Audience"];
            var jwtKey = configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
            {
                throw new Exception("Jwt settings are not set.");
            }

            var claims = new List<Claim>();

            if(user.Id == null) throw new ArgumentNullException(nameof(user.Id));
            if(user.UserName == null) throw new ArgumentNullException(nameof(user.UserName));

            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
            claims.Add(new Claim(ClaimTypes.Name, user.UserName));

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> CreateRefreshTokenAsync(IdentityUser user)
        {
            // Generate a new refresh token.
            var randomNumber = new byte[64];
            var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            var refreshToken = new RefreshToken
            {
                TokenHashed = HashRefreshToken(Convert.ToBase64String(randomNumber)),
                ExpirationDate = DateTime.Now.AddDays(30).ToUniversalTime(),
                UserId = user.Id,
                User = user
            };

            context.RefreshTokens.Add(refreshToken);
            await context.SaveChangesAsync();

            if (refreshToken == null) throw new ArgumentNullException(nameof(refreshToken));

            return Convert.ToBase64String(randomNumber);
        }

        public async Task<List<RefreshToken>> GetAllRefreshTokensForUserAsync(string userId)
        {
            return await context.RefreshTokens.Where(rt => rt.UserId == userId).ToListAsync();
        }

        public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
        {
            return await context.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHashed == HashRefreshToken(token));
        }

        public async Task<RefreshToken?> RevokeRefreshTokenAsync(RefreshToken refreshToken)
        {
            var tokenFromDb = await context.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHashed == refreshToken.TokenHashed);

            if (tokenFromDb == null) return null;

            // Delete the token.
            context.RefreshTokens.Remove(tokenFromDb);
            await context.SaveChangesAsync();

            return tokenFromDb;
        }

        public string HashRefreshToken(string token)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] tokenBytes = Encoding.UTF8.GetBytes(token);
                byte[] hashBytes = sha256.ComputeHash(tokenBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }

        public bool VerifyRefreshToken(string token, string hash)
        {
            return HashRefreshToken(token) == hash;
        }

        
    }
}
