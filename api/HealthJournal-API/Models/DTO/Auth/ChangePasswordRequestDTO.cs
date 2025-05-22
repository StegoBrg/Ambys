namespace HealthJournal_API.Models.DTO.Auth
{
    public class ChangePasswordRequestDTO
    {
        public required string OldPassword { get; set; }
        public required string NewPassword { get; set; }
    }
}
