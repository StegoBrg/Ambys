using HealthJournal_API.Migrations;
using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class NotebookRepositoryPostgres : INotebookRepository
    {
        private readonly AppDbContext dbContext;
        private readonly IUserContext userContext;

        public NotebookRepositoryPostgres(AppDbContext dbContext, IUserContext userContext)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
        }

        public async Task<IEnumerable<Notebook>> GetAllNotebooksAsync()
        {
            var userId = userContext.GetUserId();

            // Get all notebooks for the user and shared notebooks (userId = null).
            var allNotebooks = await dbContext.Notebooks.Include(d => d.Pages).ThenInclude(a => a.Subpages).Where(x => x.UserId == userId || x.UserId == null).ToListAsync();

            // Subpages normally appear double. Once as a child of the notebook and once as a subpage.
            // Filter out all pages that have a parent id.
            allNotebooks.ForEach(notebook => notebook.Pages = notebook.Pages.Where(page => page.ParentId == null).ToList());

            return allNotebooks;
        }

        public async Task<Notebook?> GetNotebookAsync(int notebookId)
        {
            var userId = userContext.GetUserId();

            var notebook = await dbContext.Notebooks.Include(d => d.Pages).ThenInclude(a => a.Subpages).Where(x => x.UserId == userId || x.UserId == null).FirstOrDefaultAsync(x => x.Id == notebookId);

            if(notebook == null) return null;

            // Subpages normally appear double. Once as a child of the notebook and once as a subpage.
            // Filter out all pages that have a parent id.
            notebook.Pages = notebook.Pages.Where(page => page.ParentId == null).ToList();

            return notebook;
        }

        public async Task<Notebook?> AddNotebookAsync(Notebook notebookToAdd, bool isShared)
        {
            var userId = userContext.GetUserId();
            if (userId == null) throw new UnauthorizedAccessException("This should never happen! If you see this error, please open a Github Issue.");

            var notebookToAddModel = await dbContext.Notebooks.Where(x => x.UserId == userId || x.UserId == null).FirstOrDefaultAsync(x => x.Title == notebookToAdd.Title);

            // Return null if entry exists because two entries with the same name are not allowed.
            if (notebookToAddModel != null) return null;

            notebookToAdd.UserId = isShared ? null : userId;            

            await dbContext.Notebooks.AddAsync(notebookToAdd);
            await dbContext.SaveChangesAsync();
            return notebookToAdd;
        }

        public async Task<Notebook?> UpdateNotebookAsync(int notebookId, Notebook updatedNotebook)
        {
            var userId = userContext.GetUserId();

            var notebookToUpdate = await dbContext.Notebooks.Where(x => x.UserId == userId || x.UserId == null).FirstOrDefaultAsync(x => x.Id == notebookId);

            if (notebookToUpdate == null) return null;

            notebookToUpdate.Title = updatedNotebook.Title;

            await dbContext.SaveChangesAsync();
            return notebookToUpdate;
        }

        public async Task<Notebook?> DeleteNotebookAsync(int notebookId)
        {
            var userId = userContext.GetUserId();

            var notebookToDelete = await dbContext.Notebooks.Include(d => d.Pages).ThenInclude(a => a.Subpages).Where(x => x.UserId == userId || x.UserId == null).FirstOrDefaultAsync(x => x.Id == notebookId); ;

            if (notebookToDelete == null) return null;

            dbContext.Notebooks.Remove(notebookToDelete);
            await dbContext.SaveChangesAsync();

            return notebookToDelete;
        }      
    }
}
