using System.ComponentModel;

namespace HealthJournal_API.Models.DTO.Users
{
    public class DeleteRequestDTO
    {
        public bool ConfirmDeletion { get; set; } = false;
    }
}
