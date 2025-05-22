using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Models.DTO.Users
{
    // Combination of the users table from identity and the userprofiles table.
    public class UserInformationDTO
    {
        public required string Id { get; set; }
        public required string Username { get; set; }
        public required string FullName { get; set; }
        public string? ProfilePicture { get; set; }
        public required List<string> Roles { get; set; }
    }
}
