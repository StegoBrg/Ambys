using System.ComponentModel.DataAnnotations;

namespace HealthJournal_API.Models.DTO.Notebook
{
    public class UpdateNotebookDTO
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Title is required.")]
        public required string Title { get; set; }
    }
}
