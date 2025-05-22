using System.ComponentModel.DataAnnotations.Schema;

namespace HealthJournal_API.Models.Domain
{
    public class NoteConfigurationAttribute
    {
        public int Id { get; set; }
                
        public int Order { get; set; }

        public int NoteConfigurationId { get; set; }
        [ForeignKey(nameof(NoteConfigurationId))]
        public NoteConfiguration NoteConfiguration { get; set; } = null!;

        public int NoteAttributeId { get; set; }
        [ForeignKey(nameof(NoteAttributeId))]
        public NoteAttribute NoteAttribute { get; set; } = null!;
    }
}
