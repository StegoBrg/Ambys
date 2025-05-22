using HealthJournal_API.Models.DTO.NoteAttribute;
using HealthJournal_API.Models.DTO.NoteConfigurationAttribute;

namespace HealthJournal_API.Models.DTO.NoteConfiguration
{
    public class UpdateNoteConfigurationDTO
    {
        public required List<NoteConfigurationAttributeDTO> NoteAttributes { get; set; }
    }
}
