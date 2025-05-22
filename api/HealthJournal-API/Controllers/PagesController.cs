using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO.DailyNote;
using HealthJournal_API.Models.DTO.Notebook;
using HealthJournal_API.Models.DTO.Page;
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
    public class PagesController : ControllerBase
    {
        private readonly IPageRepository pageRepository;
        private readonly IMapper mapper;

        public PagesController(IPageRepository pageRepository, IMapper mapper)
        {
            this.pageRepository = pageRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        [Route("notebook/{notebookId:int}")]
        public async Task<IActionResult> GetAllPagesForNotebook([FromRoute] int notebookId)
        {
            IEnumerable<Page> pages = await pageRepository.GetAllPagesForNotebookAsync(notebookId);
            IEnumerable<PageDTO> pagesDTO = mapper.Map<IEnumerable<PageDTO>>(pages);
            return Ok(pagesDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPage([FromRoute] int id)
        {
            var page = await pageRepository.GetPageAsync(id);
            if (page == null) return NotFound();

            return Ok(mapper.Map<PageDTO>(page));
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> AddPage([FromBody] AddPageDTO pageToAdd)
        {
            var pageModel = mapper.Map<Page>(pageToAdd);

            pageModel = await pageRepository.AddPageAsync(pageModel);

            if (pageModel == null) return BadRequest("Page with the same title already exists in the same notebook.");

            var pageDTO = mapper.Map<PageDTO>(pageModel);
            return CreatedAtAction(nameof(AddPage), new { id = pageDTO.Id }, pageDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateNotebook(int id, UpdatePageDTO pageToUpdate)
        {
            var pageModel = mapper.Map<Page>(pageToUpdate);
            var updatedPage = await pageRepository.UpdatePageAsync(id, pageModel);

            if (pageModel == null) return NotFound();

            return Ok(mapper.Map<PageDTO>(pageModel));
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeletePage([FromRoute] int id)
        {
            var pageModel = await pageRepository.DeletePageAsync(id);
            if (pageModel == null) return NotFound();

            return Ok(mapper.Map<PageDTO>(pageModel));
        }
    }
}
