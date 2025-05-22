namespace HealthJournal_API.Models.DTO.PersonalAccessToken
{
    public class PersonalAccessTokenDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string UserId { get; set; }
        public required List<string> Roles { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
