using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO;
using HealthJournal_API.Models.DTO.DailyNote;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace HealthJournal_API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + ",PersonalAccessToken")]
    public class DailyNotesController : ControllerBase
    {
        private readonly IDailyNoteRepository dailyNoteRepository;
        private readonly IMapper mapper;

        public DailyNotesController(IDailyNoteRepository dailyNoteRepository, IMapper mapper)
        {
            this.dailyNoteRepository = dailyNoteRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDailyNotes([FromQuery] string? startDate, [FromQuery] string? endDate)
        {
            if (!DateOnly.TryParse(startDate, out DateOnly startDateDate) && !string.IsNullOrWhiteSpace(startDate))
            {
                return BadRequest(new BadHttpRequestException("Parameter \"startDate\" is not a valid date."));
            }

            if (!DateOnly.TryParse(endDate, out DateOnly endDateDate) && !string.IsNullOrWhiteSpace(endDate))
            {
                return BadRequest(new BadHttpRequestException("Parameter \"endDate\" is not a valid date."));
            }

            DateOnly? startDateParam = startDate != null ? startDateDate : null;
            DateOnly? endDateParam = endDate != null ? endDateDate : null;

            IEnumerable<DailyNote> dailyNotes = await dailyNoteRepository.GetAllDailyNotesAsync(startDateParam, endDateParam);
            IEnumerable<DailyNoteDTO> dailyNotesDTO = mapper.Map<IEnumerable<DailyNoteDTO>>(dailyNotes);
            return Ok(dailyNotesDTO);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetDailyNote([FromRoute] int id)
        {
            var dailyNote = await dailyNoteRepository.GetDailyNoteAsync(id);
            if (dailyNote == null) return NotFound();

            return Ok(mapper.Map<DailyNoteDTO>(dailyNote));
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> AddDailyNote([FromBody] AddDailyNoteDTO dailyNoteToAdd)
        {
            var dailyNoteModel = mapper.Map<DailyNote>(dailyNoteToAdd);

            dailyNoteModel = await dailyNoteRepository.AddDailyNoteAsync(dailyNoteModel);

            if (dailyNoteModel == null) return BadRequest(new BadHttpRequestException("Entry with the same date already exists."));

            var dailyNoteDTO = mapper.Map<DailyNoteDTO>(dailyNoteModel);
            return CreatedAtAction(nameof(AddDailyNote), new { id = dailyNoteDTO.Id }, dailyNoteDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateDailyNote(int id, UpdateDailyNoteDTO dailyNoteToUpdate)
        {
            var dailyNoteModel = mapper.Map<DailyNote>(dailyNoteToUpdate);
            dailyNoteModel = await dailyNoteRepository.UpdateDailyNoteAsync(id, dailyNoteModel);
            if(dailyNoteModel == null) return NotFound();

            return Ok(mapper.Map<DailyNoteDTO>(dailyNoteModel));
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteDailyNote([FromRoute] int id)
        {
            var dailyNoteModel = await dailyNoteRepository.DeleteDailyNoteAsync(id);
            if(dailyNoteModel == null) return NotFound();

            return Ok(mapper.Map<DailyNoteDTO>(dailyNoteModel));
        }

        [HttpGet]
        [Route("export")]
        public async Task<IActionResult> ExportDailyNotes()
        {
            IEnumerable<DailyNote> dailyNotes = await dailyNoteRepository.GetAllDailyNotesAsync();

            StringBuilder csvContent = new StringBuilder();
            csvContent.AppendLine("Id,Date,Attributes");

            foreach (var dailyNote in dailyNotes)
            {
                var attributes = dailyNote.Attributes.Select(attribute => new
                {
                    Name = attribute.NoteAttribute.Name,
                    Value = attribute.Value
                });

                string attributesJson = JsonSerializer.Serialize(attributes);

                // Escape double quotes for CSV
                string escapedJson = "\"" + attributesJson.Replace("\"", "\"\"") + "\"";

                csvContent.AppendLine($"{dailyNote.Id},{dailyNote.Date},{escapedJson}");
            }

            byte[] csvBytes = Encoding.UTF8.GetBytes(csvContent.ToString());

            return File(csvBytes, "text/csv", "daily_notes.csv");
        }
    }
}
