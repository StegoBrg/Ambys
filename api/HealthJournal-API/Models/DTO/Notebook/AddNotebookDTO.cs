using HealthJournal_API.Models.DTO.Page;
using System.ComponentModel.DataAnnotations;

namespace HealthJournal_API.Models.DTO.Notebook
{
    public class AddNotebookDTO
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Title is required.")]
        public required string Title { get; set; }
        public bool IsShared { get; set; } = false;
    }
}
