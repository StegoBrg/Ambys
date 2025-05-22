using HealthJournal_API.Models.DTO.NoteConfigurationAttribute;

namespace HealthJournal_API.Models.DTO.NoteConfiguration
{
    public class NoteConfigurationDTO
    {
        public int Id { get; set; }
        public required List<NoteConfigurationAttributeDTO> NoteAttributes { get; set; }
    }
}
