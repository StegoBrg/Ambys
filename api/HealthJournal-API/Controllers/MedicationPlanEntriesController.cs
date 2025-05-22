using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO.MedicationPlanEntry;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthJournal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + ",PersonalAccessToken")]
    public class MedicationPlanEntriesController : ControllerBase
    {
        private readonly IMedicationPlanEntryRepository medicationPlanEntryRepository;
        private readonly IMapper mapper;

        public MedicationPlanEntriesController(IMedicationPlanEntryRepository medicationPlanEntryRepository, IMapper mapper)
        {
            this.medicationPlanEntryRepository = medicationPlanEntryRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMedicationPlanEntries()
        {
            var medicationPlanEntries = await medicationPlanEntryRepository.GetAllMedicationPlanEntriesAsync();
            var medicationPlanEntriesDTO = mapper.Map<IEnumerable<MedicationPlanEntryDTO>>(medicationPlanEntries);
            return Ok(medicationPlanEntriesDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetMedicationPlanEntry([FromRoute] int id)
        {
            var medicationPlanEntry = await medicationPlanEntryRepository.GetMedicationPlanEntryAsync(id);
            if (medicationPlanEntry == null) return NotFound();

            return Ok(mapper.Map<MedicationPlanEntryDTO>(medicationPlanEntry));
        }

        [HttpGet]
        [Route("date/{dateString}")]
        public async Task<IActionResult> GetMedicationPlanEntriesByDate([FromRoute] string dateString)
        {
            if (!DateOnly.TryParse(dateString, out DateOnly date))
            {
                return BadRequest(new BadHttpRequestException("Parameter \"dateString\" is not a valid date."));
            }

            var medicationPlanEntries = await medicationPlanEntryRepository.GetEntriesByDate(date);
            var medicationPlanEntriesDTO = mapper.Map<IEnumerable<MedicationPlanEntryDTO>>(medicationPlanEntries);
            return Ok(medicationPlanEntriesDTO);
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> AddMedicationPlanEntry([FromBody] AddMedicationPlanEntryDTO medicationPlanEntryToAdd)
        {
            var medicationPlanEntryModel = mapper.Map<MedicationPlanEntry>(medicationPlanEntryToAdd);

            medicationPlanEntryModel = await medicationPlanEntryRepository.AddMedicationPlanEntryAsync(medicationPlanEntryModel);

            var medicationPlanEntryDTO = mapper.Map<MedicationPlanEntryDTO>(medicationPlanEntryModel);
            return CreatedAtAction(nameof(AddMedicationPlanEntry), new { id = medicationPlanEntryDTO.Id }, medicationPlanEntryDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateMedicationPlanEntry([FromRoute] int id, [FromBody] UpdateMedicationPlanEntryDTO medicationPlanEntryToUpdate)
        {
            var medicationPlanEntryModel = mapper.Map<MedicationPlanEntry>(medicationPlanEntryToUpdate);

            var updatedMedicationPlanEntry = await medicationPlanEntryRepository.UpdateMedicationPlanEntryAsync(id, medicationPlanEntryModel);
            if (updatedMedicationPlanEntry == null) return NotFound();

            var medicationPlanEntryDTO = mapper.Map<MedicationPlanEntryDTO>(updatedMedicationPlanEntry);
            return Ok(medicationPlanEntryDTO);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteMedicationPlanEntry([FromRoute] int id)
        {
            var deletedMedicationPlanEntry = await medicationPlanEntryRepository.DeleteMedicationPlanEntryAsync(id);
            if (deletedMedicationPlanEntry == null) return NotFound();

            var medicationPlanEntryDTO = mapper.Map<MedicationPlanEntryDTO>(deletedMedicationPlanEntry);
            return Ok(medicationPlanEntryDTO);
        }
    }
}
