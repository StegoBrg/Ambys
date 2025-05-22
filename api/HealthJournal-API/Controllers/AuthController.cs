using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO;
using HealthJournal_API.Models.DTO.Auth;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HealthJournal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly IUserProfileRepository userProfileRepository;
        private readonly IConfiguration configuration;

        public AuthController(UserManager<IdentityUser> userManager, ITokenRepository tokenRepository, IUserProfileRepository userProfileRepository, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.userProfileRepository = userProfileRepository;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            // Check if signups are disabled.
            var signUpDisabled = configuration["AuthSettings:DisableSignup"];

            if (signUpDisabled == null)
            {
                throw new Exception("DisableSignups is not configured!");
            }

            // Forbid signups if the setting is set to true and there are already users in the database.
            if (signUpDisabled == "true" && userManager.Users.Any())
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "SignUpDisabled",
                    Description = "Signups are disabled!"
                });
            }


            var newUser = new IdentityUser { UserName = request.Username };
            var identityResult = await userManager.CreateAsync(newUser, request.Password);

            if (identityResult.Succeeded) 
            {
                // Assign role User as default. If the user is the first user, assign role Admin.
                if (userManager.Users.Count() == 1)
                {
                    identityResult = await userManager.AddToRoleAsync(newUser, "Admin");
                }
                else
                {
                    identityResult = await userManager.AddToRoleAsync(newUser, "User");
                }

                // Create a user profile for the new user.
                var userProfile = new UserProfile
                {
                    UserId = newUser.Id,
                    FullName = "",
                    User = newUser
                };
                await userProfileRepository.AddUserProfileAsync(userProfile);

                if(identityResult.Succeeded)
                {
                    var response = new RegisterResponseDTO
                    {
                        Username = newUser.UserName,
                        Message = "User was registered! You can login now."
                        
                    };
                    return Ok(response);
                }
            }

            // Some kind of error occured. If identyResult has errors, return them, otherwise return a generic error.
            if(identityResult.Errors != null && identityResult.Errors.Count() > 0)
            {
                return BadRequest(identityResult.Errors);
            }
            else
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "UnknownError",
                    Description = "An unknown error occured!"
                });
            }   
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            var user = await userManager.FindByNameAsync(request.Username);

            if (user == null) 
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "NonExistantUser",
                    Description = "User does not exist!"
                });
            } 
            
            var isPasswordCorrect = await userManager.CheckPasswordAsync(user, request.Password);

            if (!isPasswordCorrect) 
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "WrongPassword",
                    Description = "Password is not correct!"
                });
            }
  
            var roles = await userManager.GetRolesAsync(user);

            if(roles == null)
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "NoRoles",
                    Description = "User has no roles assigned!"
                });
            }

            var token = tokenRepository.CreateJwtToken(user, roles.ToList());
            var refreshToken = await tokenRepository.CreateRefreshTokenAsync(user);
            var response = new LoginResponseDTO
            {
                AccessToken = token,
                RefreshToken = refreshToken
            };

            return Ok(response);
        }

        [HttpPost]
        [Route("Logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "UserNotFound",
                    Description = "User not found!"
                });
            }

            // Revoke all refresh tokens for this user.
            var refreshTokens = await tokenRepository.GetAllRefreshTokensForUserAsync(user.Id);
            foreach (var token in refreshTokens)
            {
                await tokenRepository.RevokeRefreshTokenAsync(token);
            }

            return Ok(new LogoutResponseDTO
            {
                Message = "User was logged out successfully!"
            });
        }

        [HttpPost]
        [Route("Refresh-Token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDTO request)
        {
            var storedRefreshToken = await tokenRepository.GetRefreshTokenAsync(request.RefreshToken);

            if(storedRefreshToken == null)
            {
                return Unauthorized(new ErrorResponseDTO
                {
                    Code = "InvalidRefreshToken",
                    Description = "Refresh token is invalid or has been revoked!"
                });
            }

            if (storedRefreshToken.ExpirationDate <= DateTime.UtcNow)
            {
                // Delete expired token.
                await tokenRepository.RevokeRefreshTokenAsync(storedRefreshToken);

                return Unauthorized(new ErrorResponseDTO
                {
                    Code = "InvalidRefreshToken",
                    Description = "Refresh token is invalid or has been revoked!"
                });
            }
          
            // Generate new access token.
            var user = await userManager.FindByIdAsync(storedRefreshToken.UserId);
            
            if(user == null)
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "UserNotFound",
                    Description = "User not found!"
                });
            }
            var roles = await userManager.GetRolesAsync(user);

            var newAccessToken = tokenRepository.CreateJwtToken(user, roles.ToList());

            return Ok(new RefreshTokenResponseDTO
            {
                AccessToken = newAccessToken,
                RefreshToken = request.RefreshToken,
            });
        }

        [HttpPost]
        [Route("Change-Password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDTO request)
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "UserNotFound",
                    Description = "User not found!"
                });
            }

            var result = await userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);

            if(!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Revoke all refresh tokens for this user.
            var refreshTokens = await tokenRepository.GetAllRefreshTokensForUserAsync(user.Id);
            foreach (var token in refreshTokens)
            {
                await tokenRepository.RevokeRefreshTokenAsync(token);
            }

            return Ok(new ChangePasswordResponseDTO
            {
                Message = "Password was changed successfully!"
            });
        }
    }
}
