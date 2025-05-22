namespace HealthJournal_API.Models.Domain
{
    public class Notebook
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        // This will not be a foreign key since Entity Framework Core does not support foreign keys from different dbContexts.
        public string? UserId { get; set; } // null if the notebook is shared.
        public List<Page> Pages { get; set; } = new();
    }
}
