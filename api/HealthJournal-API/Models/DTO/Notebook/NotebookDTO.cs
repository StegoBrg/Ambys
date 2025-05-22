using HealthJournal_API.Models.DTO.Page;

namespace HealthJournal_API.Models.DTO.Notebook
{
    public class NotebookDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public List<PageDTO> Pages { get; set; } = new();
        public bool isShared { get; set; }
    }
}
