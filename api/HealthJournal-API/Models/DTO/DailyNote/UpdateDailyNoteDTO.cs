using HealthJournal_API.Models.DTO.DailyNoteAttribute;
using System.ComponentModel.DataAnnotations;

namespace HealthJournal_API.Models.DTO
{
    public class UpdateDailyNoteDTO
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Date is required.")]
        public required DateOnly Date { get; set; }
        public required List<DailyNoteAttributeDTO> Attributes { get; set; }
    }
}
