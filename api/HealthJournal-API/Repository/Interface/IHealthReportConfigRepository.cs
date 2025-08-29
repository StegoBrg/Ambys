using HealthJournal_API.Models.Domain;

namespace HealthJournal_API.Repository.Interface
{
    public interface IHealthReportConfigRepository
    {
        Task<IEnumerable<HealthReportConfig>> GetAllHealthReportConfigsAsync();
        Task<HealthReportConfig?> GetHealthReportConfigAsync(int reportConfigId);
        Task<HealthReportConfig?> AddHealthReportConfigAsync(HealthReportConfig reportConfigToAdd);
        Task<HealthReportConfig?> DeleteHealthReportConfigAsync(int reportConfigId);
    }
}
