using HealthJournal_API.Models.DTO.DailyNoteAttribute;

namespace HealthJournal_API.Models.DTO.DailyNote
{
    public class DailyNoteDTO
    {
        public required int Id { get; set; }
        public required DateOnly Date { get; set; }
        public required List<DailyNoteAttributeDTO> Attributes { get; set; }
    }
}
