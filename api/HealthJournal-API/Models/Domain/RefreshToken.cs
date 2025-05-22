using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthJournal_API.Models.Domain
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public required string TokenHashed { get; set; }
        public required DateTime ExpirationDate { get; set; }

        public required string UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public required IdentityUser User { get; set; }
    }
}
