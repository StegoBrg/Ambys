namespace HealthJournal_API.Models.DTO.HealthReportConfigs
{
    public class HealthReportConfigDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public List<AttributeVisualization> AttributesVisualizations { get; set; } = new List<AttributeVisualization>();
        public ColorCodeConfiguration? ColorCodeConfig { get; set; }
        public bool IncludeMedicationList { get; set; }
        public string? AdditionalNotes { get; set; }
    }

    public class AttributeVisualization
    {
        public required string AttributeName { get; set; }
        public VisualizationType VisualizationType { get; set; }
        public DiaryFilterConfiguration? Filter { get; set; }

    }

    public class ColorCodeConfiguration
    {
        public LogicGate LogicGate { get; set; }
        public List<FilterClause> Clauses { get; set; } = new List<FilterClause>();
        public required string ColorHex { get; set; }
    }

    public class DiaryFilterConfiguration
    {
        public LogicGate LogicGate { get; set; }
        public List<FilterClause> Clauses { get; set; } = new List<FilterClause>();
    }

    public class FilterClause
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
