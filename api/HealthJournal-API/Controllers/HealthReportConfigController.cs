using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO.HealthReportConfigs;
using HealthJournal_API.Models.DTO.MedicationPlanEntry;
using HealthJournal_API.Models.DTO.Notebook;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthJournal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + ",PersonalAccessToken")]
    public class HealthReportConfigController : ControllerBase
    {
        private readonly IHealthReportConfigRepository healthReportConfigRepository;
        private readonly IMapper mapper;

        public HealthReportConfigController(IHealthReportConfigRepository healthReportConfigRepository, IMapper mapper)
        {
            this.healthReportConfigRepository = healthReportConfigRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHealthReportConfigs()
        {
            var healthReportConfigs = await healthReportConfigRepository.GetAllHealthReportConfigsAsync();
            var healthReportConfigsDTO = mapper.Map<IEnumerable<HealthReportConfigDTO>>(healthReportConfigs);
            return Ok(healthReportConfigsDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetHealthReportConfig([FromRoute] int id)
        {
            var healthReportConfig = await healthReportConfigRepository.GetHealthReportConfigAsync(id);
            if (healthReportConfig == null) return NotFound();

            return Ok(mapper.Map<MedicationPlanEntryDTO>(healthReportConfig));
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> AddHealthReportConfig([FromBody] AddHealthReportConfigDTO reportConfigToAdd)
        {
            var reportConfigModel = mapper.Map<HealthReportConfig>(reportConfigToAdd);

            reportConfigModel = await healthReportConfigRepository.AddHealthReportConfigAsync(reportConfigModel);

            var reportConfigDTO = mapper.Map<HealthReportConfigDTO>(reportConfigModel);
            return CreatedAtAction(nameof(AddHealthReportConfigDTO), new { id = reportConfigDTO.Id }, reportConfigDTO);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteHealthReportConfig([FromRoute] int id)
        {
            var reportConfigModel = await healthReportConfigRepository.DeleteHealthReportConfigAsync(id);
            if (reportConfigModel == null) return NotFound();

            return Ok(mapper.Map<HealthReportConfigDTO>(reportConfigModel));
        }
    }
}
