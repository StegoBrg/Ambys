using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Repository.Interface
{
    public interface INoteAttributeRepository
    {
        Task<IEnumerable<NoteAttribute>> GetAllNoteAttributesAsync();
        Task<NoteAttribute?> GetNoteAttributeAsync(int noteAttributeId);
        Task<NoteAttribute?> AddNoteAttributeAsync(NoteAttribute noteAttributeToAdd);
        Task<NoteAttribute?> UpdateNoteAttributeAsync(int noteAttributeId, NoteAttribute updatedNoteAttribute);
        Task<NoteAttribute?> DeleteNoteAttributeAsync(int noteAttributeId);
    }
}
