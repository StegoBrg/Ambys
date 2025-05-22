using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Repository.Interface
{
    public interface INoteConfigurationRepository
    {
        Task<IEnumerable<NoteConfiguration>> GetAllNoteConfigurationsAsync();
        Task<NoteConfiguration?> GetNoteConfigurationAsync(int noteConfigurationId);
        Task<NoteConfiguration?> AddNoteConfigurationAsync(NoteConfiguration noteConfigurationToAdd);
        Task<NoteConfiguration?> UpdateNoteConfigurationAsync(int noteConfigurationId, NoteConfiguration updatedConfiguration);
        Task<NoteConfiguration?> DeleteNoteConfigurationAsync(int noteConfigurationId);
    }
}
