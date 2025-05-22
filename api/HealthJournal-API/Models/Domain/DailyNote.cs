using HealthJournal_API.Models.DTO.DailyNoteAttribute;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Models.Domain
{
    [Index(nameof(Date), IsUnique = true)]
    public class DailyNote
    {
        public required int Id { get; set; }
        public required DateOnly Date {  get; set; }
        public required string UserId { get; set; }
        public required List<DailyNoteAttribute> Attributes { get; set; }
    }
}
