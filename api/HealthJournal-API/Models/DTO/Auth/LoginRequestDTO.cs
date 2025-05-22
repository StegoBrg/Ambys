using System.ComponentModel.DataAnnotations;

namespace HealthJournal_API.Models.DTO.Auth
{
    public class LoginRequestDTO
    {
        public required string Username { get; set; }
        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }
}
