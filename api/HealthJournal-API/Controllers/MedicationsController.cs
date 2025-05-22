using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO.Medication;
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
    public class MedicationsController : ControllerBase
    {
        private readonly IMedicationRepository medicationRepository;
        private readonly IMapper mapper;

        public MedicationsController(IMedicationRepository medicationRepository, IMapper mapper)
        {
            this.medicationRepository = medicationRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMedications()
        {
            var medications = await medicationRepository.GetAllMedicationAsync();
            var medicationsDTO = mapper.Map<IEnumerable<MedicationDTO>>(medications);
            return Ok(medicationsDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetMedication([FromRoute] int id)
        {
            var medication = await medicationRepository.GetMedicationAsync(id);
            if (medication == null) return NotFound();

            return Ok(mapper.Map<MedicationDTO>(medication));
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> AddMedication([FromBody] AddMedicationDTO medicationToAdd)
        {
            var medicationModel = mapper.Map<Medication>(medicationToAdd);

            medicationModel = await medicationRepository.AddMedicationAsync(medicationModel);

            var medicationDTO = mapper.Map<MedicationDTO>(medicationModel);
            return CreatedAtAction(nameof(AddMedication), new { id = medicationDTO.Id }, medicationDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateMedication([FromRoute] int id, [FromBody] UpdateMedicationDTO medicationToUpdate)
        {
            var medicationModel = mapper.Map<Medication>(medicationToUpdate);

            var updatedMedication = await medicationRepository.UpdateMedicationAsync(id, medicationModel);
            if (updatedMedication == null) return NotFound();

            var updatedMedicationDTO = mapper.Map<MedicationDTO>(updatedMedication);
            return Ok(updatedMedicationDTO);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteMedication([FromRoute] int id)
        {
            var deletedMedication = await medicationRepository.DeleteMedicationAsync(id);
            if (deletedMedication == null) return NotFound();

            var deletedMedicationDTO = mapper.Map<MedicationDTO>(deletedMedication);
            return Ok(deletedMedicationDTO);
        }
    }
}
