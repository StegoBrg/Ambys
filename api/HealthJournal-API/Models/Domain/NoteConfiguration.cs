namespace HealthJournal_API.Models.Domain
{
    // For now only one entrance makes sence, but in the future it would need more due to different types of notes and different users.
    public class NoteConfiguration
    {
        public int Id { get; set; }
        public required List<NoteConfigurationAttribute> NoteAttributes { get; set; }
        public required string UserId { get; set; }
    }
}
