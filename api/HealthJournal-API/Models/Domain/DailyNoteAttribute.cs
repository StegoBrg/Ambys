using System.ComponentModel.DataAnnotations.Schema;

namespace HealthJournal_API.Models.Domain
{
    // Class to combine DailyNotes and NoteAttributes.
    public class DailyNoteAttribute
    {
        public required int Id { get; set; }
        public required string Value { get; set; }

        public int DailyNoteId { get; set; }

        [ForeignKey(nameof(DailyNoteId))]
        public DailyNote DailyNote { get; set; } = null!;


        public int NoteAttributeId { get; set; }

        [ForeignKey(nameof(NoteAttributeId))]
        public NoteAttribute NoteAttribute { get; set; } = null!;
    }
}
