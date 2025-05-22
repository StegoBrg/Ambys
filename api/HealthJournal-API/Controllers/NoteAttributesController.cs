using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO.DailyNote;
using HealthJournal_API.Models.DTO;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Mvc;
using HealthJournal_API.Models.DTO.NoteAttribute;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace HealthJournal_API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + ",PersonalAccessToken")]
    public class NoteAttributesController : ControllerBase
    {
        private readonly INoteAttributeRepository noteAttributeRepository;
        private readonly IMapper mapper;

        public NoteAttributesController(INoteAttributeRepository noteAttributeRepository, IMapper mapper)
        {
            this.noteAttributeRepository = noteAttributeRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNoteAttributes()
        {
            IEnumerable<NoteAttribute> noteAttributes = await noteAttributeRepository.GetAllNoteAttributesAsync();
            IEnumerable<NoteAttributeDTO> noteAttributeDTO = mapper.Map<IEnumerable<NoteAttributeDTO>>(noteAttributes);
            return Ok(noteAttributeDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetNoteAttribute([FromRoute] int id)
        {
            var noteAttribute = await noteAttributeRepository.GetNoteAttributeAsync(id);
            if (noteAttribute == null) return NotFound();

            return Ok(mapper.Map<NoteAttributeDTO>(noteAttribute));
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> AddNoteAttribute([FromBody] AddNoteAttributeDTO noteAttributeToAdd)
        {
            var noteAttributeModel = mapper.Map<NoteAttribute>(noteAttributeToAdd);

            noteAttributeModel = await noteAttributeRepository.AddNoteAttributeAsync(noteAttributeModel);

            if (noteAttributeModel == null) return BadRequest(new BadHttpRequestException("Entry with the same name already exists."));

            var noteAttributeDTO = mapper.Map<NoteAttributeDTO>(noteAttributeModel);
            return CreatedAtAction(nameof(AddNoteAttribute), new { id = noteAttributeDTO.Id }, noteAttributeDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateNoteAttribute(int id, UpdateNoteAttributeDTO noteAttributeToUpdate)
        {
            var noteAttributeModel = mapper.Map<NoteAttribute>(noteAttributeToUpdate);
            noteAttributeModel = await noteAttributeRepository.UpdateNoteAttributeAsync(id, noteAttributeModel);
            if (noteAttributeModel == null) return NotFound();

            return Ok(mapper.Map<NoteAttributeDTO>(noteAttributeModel));
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteDailyNote([FromRoute] int id)
        {
            var noteAttributeModel = await noteAttributeRepository.DeleteNoteAttributeAsync(id);
            if (noteAttributeModel == null) return NotFound();

            return Ok(mapper.Map<NoteAttributeDTO>(noteAttributeModel));
        }
    }
}
