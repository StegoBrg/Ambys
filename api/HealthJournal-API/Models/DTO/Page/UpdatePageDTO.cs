using System.ComponentModel.DataAnnotations;

namespace HealthJournal_API.Models.DTO.Page
{
    public class UpdatePageDTO
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Title is required.")]
        public required string Title { get; set; }
        public string? Content { get; set; }

        public int? ParentId { get; set; } // If null then this is a root page.
        public required int NotebookId { get; set; }
    }
}
