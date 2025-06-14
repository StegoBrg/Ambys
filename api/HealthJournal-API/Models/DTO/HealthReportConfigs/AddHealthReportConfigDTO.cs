namespace HealthJournal_API.Models.DTO.HealthReportConfigs
{
    public class AddHealthReportConfigDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public List<AttributeVisualizationDTO> AttributesVisualizations { get; set; } = new List<AttributeVisualizationDTO>();
        public List<ColorCodeConfigurationDTO> ColorCodeConfig { get; set; } = new List<ColorCodeConfigurationDTO>();
        public bool IncludeMedicationList { get; set; }
        public string? AdditionalNotes { get; set; }
    }
}
