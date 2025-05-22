using HealthJournal_API.Models.DTO.NoteAttribute;

namespace HealthJournal_API.Models.DTO.NoteConfiguration
{
    public class AddNoteConfigurationDTO
    {
        public required List<NoteAttributeDTO> NoteAttributes { get; set; }
    }
}
