using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Repository.Interface
{
    public interface IPageRepository
    {
        Task<IEnumerable<Page>> GetAllPagesForNotebookAsync(int notebookId);
        Task<Page?> GetPageAsync(int pageId);
        Task<Page?> AddPageAsync(Page pageToAdd);
        Task<Page?> UpdatePageAsync(int pageId, Page updatedPage);
        Task<Page?> DeletePageAsync(int pageId);
    }
}
