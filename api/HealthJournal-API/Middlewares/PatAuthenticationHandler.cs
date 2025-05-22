using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text;
using HealthJournal_API.Models;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Middlewares
{
    public class PatAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly AuthDbContext context;

        public PatAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            AuthDbContext context)
            : base(options, logger, encoder)
        {
            this.context = context;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Check if the request contains an Authorization header.
            if (!Request.Headers.ContainsKey("Authorization"))
                return AuthenticateResult.NoResult();

            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
                return AuthenticateResult.Fail("Invalid Authorization header format");

            var token = authHeader.Substring("Bearer ".Length).Trim();

            if (string.IsNullOrEmpty(token))
                return AuthenticateResult.Fail("Token is missing");

            // Check if it's a valid API Token (PAT)
            using var sha256 = SHA256.Create();
            var tokenHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(token)));

            var apiToken = await context.PersonalAccessTokens
                .FirstOrDefaultAsync(t => t.TokenHashed == tokenHash);

            if (apiToken != null)
            {
                // Authorization token is a valid PAT, authenticate the user.
                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, apiToken.UserId)
                    };

                foreach (var role in apiToken.Roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var identity = new ClaimsIdentity(claims, "PersonalAccessToken");
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, "PersonalAccessToken");

                return AuthenticateResult.Success(ticket);
            }

            // If it is not a PAT, let JWT handle auth.
            return AuthenticateResult.NoResult();
        }
    }
}
