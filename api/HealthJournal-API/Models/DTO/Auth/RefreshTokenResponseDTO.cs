namespace HealthJournal_API.Models.DTO.Auth
{
    public class RefreshTokenResponseDTO
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}
