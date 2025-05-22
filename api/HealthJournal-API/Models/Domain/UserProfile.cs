using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthJournal_API.Models.Domain
{
    // Holds additional user information that are not present in the users table from identity.
    public class UserProfile
    {
        [Key]
        public required string UserId { get; set; }
        public required string FullName { get; set; }
        public string? ProfilePicture { get; set; }

        [ForeignKey(nameof(UserId))]
        public required IdentityUser User { get; set; }
    }
}
