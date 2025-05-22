using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class PageRepositoryPostgres : IPageRepository
    {
        private readonly AppDbContext dbContext;
        private readonly IUserContext userContext;

        public PageRepositoryPostgres(AppDbContext dbContext, IUserContext userContext)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
        }

        public async Task<IEnumerable<Page>> GetAllPagesForNotebookAsync(int notebookId)
        {
            var userId = userContext.GetUserId();

            // Only get main pages.
            // Also only get pages that belong to the user or are public.
            return await dbContext.Pages.Where(x => x.NotebookId == notebookId && x.ParentId == null).Include(d => d.Subpages).Where(x => x.Notebook.UserId == userId || x.Notebook.UserId == null).ToListAsync();
        }

        public async Task<Page?> GetPageAsync(int pageId)
        {
            var userId = userContext.GetUserId();

            return await dbContext.Pages.Include(d => d.Subpages).Where(x => x.Notebook.UserId == userId || x.Notebook.UserId == null).FirstOrDefaultAsync(x => x.Id == pageId);
        }

        public async Task<Page?> AddPageAsync(Page pageToAdd)
        {
            var userId = userContext.GetUserId();

            // Check if page with the same title already exists in the same notebook.
            // Only one page with the same title is allowed in the same notebook.
            var pageToAddModel = await dbContext.Pages.FirstOrDefaultAsync(x => x.Title == pageToAdd.Title && x.NotebookId == pageToAdd.NotebookId);
            if (pageToAddModel != null) return null; 

            // Make sure that the page can only be added to a notebook that belongs to the user or is public.
            var notebook = await dbContext.Notebooks.FirstOrDefaultAsync(x => x.Id == pageToAdd.NotebookId);
            if (notebook == null || (notebook.UserId != userId && notebook.UserId != null)) return null; // TODO: Return specific error message.

            await dbContext.Pages.AddAsync(pageToAdd);
            await dbContext.SaveChangesAsync();
            return pageToAdd;
        }

        public async Task<Page?> UpdatePageAsync(int pageId, Page updatedPage)
        {
            var userId = userContext.GetUserId();

            var pageToUpdate = await dbContext.Pages.Where(x => x.Notebook.UserId == userId || x.Notebook.UserId == null).FirstOrDefaultAsync(x => x.Id == pageId);

            if(pageToUpdate == null) return null;

            pageToUpdate.Title = updatedPage.Title;
            pageToUpdate.Content = updatedPage.Content;
            pageToUpdate.ParentId = updatedPage.ParentId;
            pageToUpdate.NotebookId = updatedPage.NotebookId;
            pageToUpdate.Notebook = updatedPage.Notebook;

            await dbContext.SaveChangesAsync();
            return pageToUpdate;
        }

        public async Task<Page?> DeletePageAsync(int pageId)
        {
            var userId = userContext.GetUserId();

            var pageToDelete = await dbContext.Pages.Where(x => x.Notebook.UserId == userId || x.Notebook.UserId == null).FirstOrDefaultAsync(x => x.Id == pageId);

            if (pageToDelete == null) return null;

            dbContext.Pages.Remove(pageToDelete);
            await dbContext.SaveChangesAsync();

            return pageToDelete;
        }

        
    }
}
