namespace HealthJournal_API.Models.DTO.Users
{
    public class UpdateUserInfoRequestDTO
    {
        public required string UserName { get; set; }
        public required string FullName { get; set; }
    }
}
