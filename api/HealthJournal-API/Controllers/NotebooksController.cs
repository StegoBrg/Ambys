using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO.DailyNote;
using HealthJournal_API.Models.DTO;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HealthJournal_API.Models.DTO.Notebook;
using HealthJournal_API.Models.DTO.Page;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace HealthJournal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + ",PersonalAccessToken")]
    public class NotebooksController : ControllerBase
    {
        private readonly INotebookRepository notebookRepository;
        private readonly IMapper mapper;

        public NotebooksController(INotebookRepository notebookRepository, IMapper mapper)
        {
            this.notebookRepository = notebookRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotebooks()
        {
            IEnumerable<Notebook> notebooks = await notebookRepository.GetAllNotebooksAsync();
            IEnumerable<NotebookDTO> notebooksDTO = mapper.Map<IEnumerable<NotebookDTO>>(notebooks);
            return Ok(notebooksDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetNotebook([FromRoute] int id)
        {
            var notebook = await  notebookRepository.GetNotebookAsync(id);
            if (notebook == null) return NotFound();

            return Ok(mapper.Map<NotebookDTO>(notebook));
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> AddNotebook([FromBody] AddNotebookDTO notebookToAdd)
        {
            var notebookModel = mapper.Map<Notebook>(notebookToAdd);

            notebookModel = await notebookRepository.AddNotebookAsync(notebookModel, notebookToAdd.IsShared);

            if (notebookModel == null) return BadRequest(new BadHttpRequestException("Entry with the same title already exists."));

            var notebookDTO = mapper.Map<NotebookDTO>(notebookModel);
            return CreatedAtAction(nameof(AddNotebook), new { id = notebookDTO.Id }, notebookDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateNotebook(int id, UpdateNotebookDTO notebookToUpdate)
        {
            var notebookModel = mapper.Map<Notebook>(notebookToUpdate);
            var updatedNotebook = await notebookRepository.UpdateNotebookAsync(id, notebookModel);

            if (updatedNotebook == null) return NotFound();

            return Ok(mapper.Map<NotebookDTO>(updatedNotebook));
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteNotebook([FromRoute] int id)
        {
            var notebookModel = await notebookRepository.DeleteNotebookAsync(id);
            if (notebookModel == null) return NotFound();

            return Ok(mapper.Map<NotebookDTO>(notebookModel));
        }
    }
}
