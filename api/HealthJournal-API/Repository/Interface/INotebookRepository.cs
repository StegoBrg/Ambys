using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Repository.Interface
{
    public interface INotebookRepository
    {
        Task<IEnumerable<Notebook>> GetAllNotebooksAsync();
        Task<Notebook?> GetNotebookAsync(int notebookId);
        Task<Notebook?> AddNotebookAsync(Notebook notebookToAdd, bool isShared);
        Task<Notebook?> UpdateNotebookAsync(int notebookId, Notebook updatedNotebook);
        Task<Notebook?> DeleteNotebookAsync(int notebookId);
    }
}
