namespace HealthJournal_API.Models.Domain
{
    public class MedicationSchedule
    {
        public int Id { get; set; }
        public required MedicationScheduleType Type { get; set; }
        public required List<TimeOnly> TimesOfDay { get; set; } // For example: 8:00, 12:00, 18:00
        public List<DayOfWeek>? DaysOfWeek { get; set; } // Required for CustomDays. For example: Monday, Wednesday, Friday.
        public int? IntervalDays { get; set; } // Required for EveryXDays. For example: 3 days.
        public int? IntervalWeeks { get; set; } // Required for EveryXWeeks. For example: 2 weeks.
    }

    public enum MedicationScheduleType
    {
        Daily, // Every day at a specific time.
        CustomDays, // Specific days of the week. For example: Monday, Wednesday, Friday.
        EveryXDays, // Every X days. For example: Every 3 days.
        EveryXWeeks, // Every X weeks. For example: Every 2 weeks.
    }
}
