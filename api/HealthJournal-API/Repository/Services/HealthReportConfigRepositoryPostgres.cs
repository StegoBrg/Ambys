using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace HealthJournal_API.Repository.Services
{
    public class HealthReportConfigRepositoryPostgres : IHealthReportConfigRepository
    {
        private readonly AppDbContext dbContext;
        private readonly IUserContext userContext;

        public HealthReportConfigRepositoryPostgres(AppDbContext dbContext, IUserContext userContext)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
        }

        public async Task<IEnumerable<HealthReportConfig>> GetAllHealthReportConfigsAsync()
        {
            var userId = userContext.GetUserId();

            var healthReportConfigs = await dbContext.HealthReportConfigs.Where(x => x.UserId == userId).ToListAsync();

            return healthReportConfigs;
        }

        public async Task<HealthReportConfig?> GetHealthReportConfigAsync(int reportConfigId)
        {
            var userId = userContext.GetUserId();

            var healthReportConfig = await dbContext.HealthReportConfigs.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == reportConfigId);

            return healthReportConfig;
        }

        public async Task<HealthReportConfig?> AddHealthReportConfigAsync(HealthReportConfig reportConfigToAdd)
        {
            var userId = userContext.GetUserId();
            if (userId == null) throw new UnauthorizedAccessException("This should never happen! If you see this error, please open a Github Issue.");

            reportConfigToAdd.UserId = userId;

            await dbContext.HealthReportConfigs.AddAsync(reportConfigToAdd);
            await dbContext.SaveChangesAsync();
            return reportConfigToAdd;
        }

        public async Task<HealthReportConfig?> DeleteHealthReportConfigAsync(int reportConfigId)
        {
            var userId = userContext.GetUserId();

            var reportConfigToDelete = await dbContext.HealthReportConfigs.Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.Id == reportConfigId); ;

            if (reportConfigToDelete == null) return null;

            dbContext.HealthReportConfigs.Remove(reportConfigToDelete);
            await dbContext.SaveChangesAsync();

            return reportConfigToDelete;
        }
    }
}
