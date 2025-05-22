using System.ComponentModel.DataAnnotations.Schema;

namespace HealthJournal_API.Models.Domain
{
    public class Page
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Content { get; set; }

        public int? ParentId { get; set; } // If null then this is a root page.
        [ForeignKey(nameof(ParentId))]
        public Page? Parent { get; set; }

        public required int NotebookId { get; set; }
        [ForeignKey(nameof(NotebookId))]
        public required Notebook Notebook { get; set; }

        public List<Page> Subpages { get; set; } = new();
    }
}
