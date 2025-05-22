using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO.NoteAttribute;
using HealthJournal_API.Models.DTO.NoteConfiguration;
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
    public class NoteConfigurationsController : ControllerBase
    {
        private readonly INoteConfigurationRepository noteConfigurationRepository;
        private readonly IMapper mapper;

        public NoteConfigurationsController(INoteConfigurationRepository noteConfigurationRepository, IMapper mapper)
        {
            this.noteConfigurationRepository = noteConfigurationRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNoteConfigurations()
        {
            IEnumerable<NoteConfiguration> noteConfigurations = await noteConfigurationRepository.GetAllNoteConfigurationsAsync();

            // Sort List according to Order property.
            foreach (var noteConfiguration in noteConfigurations) { 
                noteConfiguration.NoteAttributes = noteConfiguration.NoteAttributes.OrderBy(x => x.Order).ToList();
            }

            IEnumerable<NoteConfigurationDTO> noteConfigurationsDTO = mapper.Map<IEnumerable<NoteConfigurationDTO>>(noteConfigurations);
            return Ok(noteConfigurationsDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetNoteConfiguration([FromRoute] int id)
        {
            var noteConfiguration = await noteConfigurationRepository.GetNoteConfigurationAsync(id);
            if (noteConfiguration == null) return NotFound();
            var noteConfigurationDTO = mapper.Map<NoteConfigurationDTO>(noteConfiguration);

            return Ok(noteConfigurationDTO);
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> AddNoteConfiguration([FromBody] AddNoteConfigurationDTO noteConfigurationToAdd)
        {
            var noteConfigurationModel = mapper.Map<NoteConfiguration>(noteConfigurationToAdd);

            noteConfigurationModel = await noteConfigurationRepository.AddNoteConfigurationAsync(noteConfigurationModel);

            if (noteConfigurationModel == null) return BadRequest(new BadHttpRequestException("Cannot add new note configuration."));

            var noteConfigurationDTO = mapper.Map<NoteConfiguration>(noteConfigurationToAdd);
            return CreatedAtAction(nameof(AddNoteConfiguration), new { id = noteConfigurationDTO.Id }, noteConfigurationDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateNoteConfiguration(int id, UpdateNoteConfigurationDTO noteConfigurationToUpdate)
        {
            var noteConfigurationModel = mapper.Map<NoteConfiguration>(noteConfigurationToUpdate);
            noteConfigurationModel = await noteConfigurationRepository.UpdateNoteConfigurationAsync(id, noteConfigurationModel);
            if (noteConfigurationModel == null) return NotFound();

            return Ok(mapper.Map<NoteConfigurationDTO>(noteConfigurationModel));
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteNoteConfiguration([FromRoute] int id)
        {
            var noteConfigurationModel = await noteConfigurationRepository.DeleteNoteConfigurationAsync(id);
            if (noteConfigurationModel == null) return NotFound();

            return Ok(mapper.Map<NoteConfigurationDTO>(noteConfigurationModel));
        }
    }
}
