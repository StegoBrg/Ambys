namespace HealthJournal_API.Models.DTO.HealthReportConfigs
{
    public class HealthReportConfigDTO
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

    public class AttributeVisualizationDTO
    {
        public required string AttributeName { get; set; }
        public VisualizationType VisualizationType { get; set; }
        public DiaryFilterConfigurationDTO? Filter { get; set; }

    }

    public class ColorCodeConfigurationDTO
    {
        public LogicGate LogicGate { get; set; }
        public List<FilterClauseDTO> Clauses { get; set; } = new List<FilterClauseDTO>();
        public required string ColorHex { get; set; }
    }

    public class DiaryFilterConfigurationDTO
    {
        public LogicGate LogicGate { get; set; }
        public List<FilterClauseDTO> Clauses { get; set; } = new List<FilterClauseDTO>();
    }

    public class FilterClauseDTO
    {
        public required string Element { get; set; }
        public required string Operator { get; set; }
        public required string Value { get; set; }
    }

    public enum VisualizationType
    {
        sum,
        min,
        max,
        average,
        aggregate,
        lineChart,
        showAll,
        showAllWithFilter
    }

    public enum LogicGate
    {
        AND,
        OR,
        XOR
    }
}
