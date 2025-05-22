namespace HealthJournal_API.Models.DTO.Medication
{
    public class MedicationDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required string Strength { get; set; } // For now this will be a single string like "500mg". In the future this could be seperated. 
        public string? Type { get; set; } // For now it will be a single string like "Tablet", "Liquid", etc. 

    }
}
