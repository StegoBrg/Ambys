using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthJournal_API.Models.Domain
{
    public class PersonalAccessToken
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string TokenHashed { get; set; }
        public required string UserId { get; set; }
        public required List<string> Roles { get; set; }
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(UserId))]
        public required IdentityUser User { get; set; }
    }
}
