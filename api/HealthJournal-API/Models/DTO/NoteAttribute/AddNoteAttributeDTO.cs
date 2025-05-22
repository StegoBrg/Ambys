using System.ComponentModel.DataAnnotations;

namespace HealthJournal_API.Models.DTO.NoteAttribute
{
    public class AddNoteAttributeDTO
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Name is required.")]
        public required string Name { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Element is required.")]
        public required string Element { get; set; }
    }
}
