using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO;
using HealthJournal_API.Models.DTO.Users;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + ",PersonalAccessToken")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly IUserProfileRepository userProfileRepository;
        private readonly IUserDataRepository userDataRepository;

        public UsersController(UserManager<IdentityUser> userManager, ITokenRepository tokenRepository, IUserProfileRepository userProfileRepository, IUserDataRepository userDataRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.userProfileRepository = userProfileRepository;
            this.userDataRepository = userDataRepository;
        }

        [HttpGet]
        [Route("self")]
        public async Task<IActionResult> GetSelf()
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null) return BadRequest(new ErrorResponseDTO
            {
                Code = "UserNotFound",
                Description = "User not found."
            });

            // Get the user profile.
            var userProfile = await userProfileRepository.GetUserProfileAsync(user.Id);

            var response = new UserInformationDTO
            {
                Id = user.Id,
                Username = user.UserName ?? "",
                FullName = userProfile?.FullName ?? "",
                ProfilePicture = userProfile?.ProfilePicture,
                Roles = userManager.GetRolesAsync(user).Result.ToList()
            };

            return Ok(response);
        }

        [HttpPost]
        [Route("self/upload-profilepicture")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ErrorResponseDTO 
                {
                    Code = "NoFileUploaded",
                    Description = "No file uploaded." 
                });
            }

            // Ensure the uploads folder exists
            var profilePicturesPath = Path.Combine("wwwroot", "api", "uploads", "profile_pictures");
            if (!Directory.Exists(profilePicturesPath))
            {
                Directory.CreateDirectory(profilePicturesPath);
            }

            // Check for allowed file types.
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            if (!allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
            {
                return BadRequest(new ErrorResponseDTO 
                {
                    Code = "InvalidFileType",
                    Description = "Invalid file type. Only JPG, JPEG and PNG files are allowed."
                });
            }

            // Validate MIME type
            var allowedMimeTypes = new[] { "image/jpeg", "image/png" };
            if (!allowedMimeTypes.Contains(file.ContentType))
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "InvalidMimeType",
                    Description = "Invalid MIME type. Only JPG, JPEG and PNG files are allowed."
                });
            }

            if (file.Length > 5 * 1024 * 1024) // 5MB
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "FileSizeTooLarge",
                    Description = "File size is too large. Maximum file size is 5MB."
                });

            // Generate a unique file name
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            var filePath = Path.Combine(profilePicturesPath, fileName);

            // Save the file to disk
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Get the current user
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            // Get or create the user profile
            var userProfile = await userProfileRepository.GetUserProfileAsync(user.Id);
            if (userProfile == null)
            {
                userProfile = new UserProfile { UserId = user.Id, FullName = "", User = user };
                await userProfileRepository.AddUserProfileAsync(userProfile);
            }

            // Set the profile picture URL (relative to your domain)
            userProfile.ProfilePicture = $"uploads/profile_pictures/{fileName}";
            await userProfileRepository.UpdateUserProfileAsync(user.Id, userProfile);

            return Ok(new { ProfilePictureUrl = userProfile.ProfilePicture });
        }

        [HttpPut]
        [Route("self")]
        public async Task<IActionResult> UpdateUserInfo([FromBody] UpdateUserInfoRequestDTO request)
        {
            // Get the current user
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            // Get or create the user profile
            var userProfile = await userProfileRepository.GetUserProfileAsync(user.Id);
            if (userProfile == null)
            {
                userProfile = new UserProfile { UserId = user.Id, FullName = "", User = user };
                await userProfileRepository.AddUserProfileAsync(userProfile);
            }

            userProfile.FullName = request.FullName;
            user.UserName = request.UserName;
            var updatedUser = await userProfileRepository.UpdateUserProfileAsync(user.Id, userProfile);

            var response = new UserInformationDTO
            {
                Id = user.Id,
                Username = user.UserName ?? "",
                FullName = userProfile.FullName,
                ProfilePicture = userProfile.ProfilePicture,
                Roles = userManager.GetRolesAsync(user).Result.ToList()
            };

            return Ok(response);
        }

        [HttpGet]
        [Route("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var identityUsers = await userManager.Users.ToListAsync();

            var userInformation = new List<UserInformationDTO>();

            foreach (var user in identityUsers)
            {
                var userProfile = await userProfileRepository.GetUserProfileAsync(user.Id);
                
                userInformation.Add(new UserInformationDTO
                {
                    Id = user.Id,
                    Username = user.UserName ?? "",
                    FullName = userProfile?.FullName ?? "",
                    ProfilePicture = userProfile?.ProfilePicture,
                    Roles = userManager.GetRolesAsync(user).Result.ToList()
                });
            }

            return Ok(userInformation);
        }

        [HttpPut]
        [Route("{userId}/change-roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeUserRoles([FromRoute] string userId, [FromBody] ChangeRoleRequestDTO request)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) 
            {
                return NotFound(new ErrorResponseDTO
                {
                    Code = "UserNotFound",
                    Description = "User not found."
                });
            }

            // Remove old roles.
            var oldRoles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, oldRoles);

            // Add new roles.
            await userManager.AddToRolesAsync(user, request.Roles);

            var userProfile = await userProfileRepository.GetUserProfileAsync(user.Id);

            var response = new UserInformationDTO
            {
                Id = user.Id,
                Username = user.UserName ?? "",
                FullName = userProfile?.FullName ?? "",
                Roles = userManager.GetRolesAsync(user).Result.ToList()
            };

            return Ok(response);
        }

        [HttpPost]
        [Route("{userId}/reset-password")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetPassword([FromRoute] string userId, [FromBody] ResetPasswordRequestDTO request)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null) return NotFound(new ErrorResponseDTO
            {
                Code = "UserNotFound",
                Description = "User not found."
            });

            var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);

            if(!result.Succeeded) return BadRequest(result.Errors);

            // Revoke all refresh tokens for this user.
            var refreshTokens = await tokenRepository.GetAllRefreshTokensForUserAsync(user.Id);
            foreach (var token in refreshTokens)
            {
                await tokenRepository.RevokeRefreshTokenAsync(token);
            }

            return Ok(new ResetPasswordResponseDTO
            {
                Message = "Password reset successfully. New password has been set."
            });
        }

        [HttpDelete]
        [Route("self")]
        public async Task<IActionResult> DeleteSelf([FromBody] DeleteRequestDTO request)
        {
            if (!request.ConfirmDeletion)
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "DeletionNotConfirmed",
                    Description = "Deletion not confirmed. Please set ConfirmDeletion to true to proceed."
                });
            }

            var user = await userManager.GetUserAsync(User);
            if (user == null) return NotFound(new ErrorResponseDTO
            {
                Code = "UserNotFound",
                Description = "User not found."
            });

            // Delete user data.
            await userDataRepository.DeleteUserDataAsync(user.Id);

            // Delete the IdentityUser.
            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new { Message = "User deleted successfully." });
        }

        [HttpDelete]
        [Route("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser([FromRoute] string userId, [FromBody] DeleteRequestDTO request)
        {
            if (!request.ConfirmDeletion)
            {
                return BadRequest(new ErrorResponseDTO
                {
                    Code = "DeletionNotConfirmed",
                    Description = "Deletion not confirmed. Please set ConfirmDeletion to true to proceed."
                });
            }

            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new ErrorResponseDTO
            {
                Code = "UserNotFound",
                Description = "User not found."
            });

            // Delete user data.
            await userDataRepository.DeleteUserDataAsync(user.Id);

            // Delete the IdentityUser.
            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new { Message = "User deleted successfully." });
        }
    }
}
