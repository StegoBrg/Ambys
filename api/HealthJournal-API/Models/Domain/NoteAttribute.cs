namespace HealthJournal_API.Models.Domain
{
    public class NoteAttribute
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Element { get; set; }
        public required string UserId { get; set; }
    }
}
