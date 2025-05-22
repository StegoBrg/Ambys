using HealthJournal_API.Models.DTO.Notebook;

namespace HealthJournal_API.Models.DTO.Page
{
    public class PageDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Content { get; set; }

        public int? ParentId { get; set; } // If null then this is a root page.
        public required int NotebookId { get; set; }

        public List<PageDTO> Subpages { get; set; } = new();
    }
}
