using AutoMapper;
using HealthJournal_API.CustomActionFilters;
using HealthJournal_API.Migrations;
using HealthJournal_API.Models.DTO;
using HealthJournal_API.Models.DTO.Notebook;
using HealthJournal_API.Models.DTO.PersonalAccessToken;
using HealthJournal_API.Repository.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HealthJournal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + ",PersonalAccessToken")]
    public class PersonalAccessTokensController : ControllerBase
    {
        private readonly IPersonalAccessTokenRepository patRepository;
        private readonly UserManager<IdentityUser> userManager;
        private readonly IMapper mapper;

        public PersonalAccessTokensController(IPersonalAccessTokenRepository patRepository, UserManager<IdentityUser> userManager, IMapper mapper)
        {
            this.patRepository = patRepository;
            this.userManager = userManager;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllForCurrUser()
        {
            var allPats = await patRepository.GetPersonalAccessTokensAsync();
            var allPatsDTO = mapper.Map<List<PersonalAccessTokenDTO>>(allPats);

            return Ok(allPatsDTO);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewToken([FromBody] GeneratePatRequestDTO request)
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null) return BadRequest(new ErrorResponseDTO
            {
                Code = "UserNotFound",
                Description = "User not found."
            });

            var newToken = await patRepository.CreatePersonalAccessTokenAsync(user, request.Name, userManager.GetRolesAsync(user).Result.ToList());

            if (newToken == null) return BadRequest(new ErrorResponseDTO
            {
                Code = "NoDoubleNames",
                Description = "Token with the same name already exists."
            });

            return Ok(new GeneratePatResponseDTO
            {
                Token = newToken,
            });
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteToken([FromRoute] int id)
        {
            var deletedToken = await patRepository.DeletePersonalAccessTokenAsync(id);    

            if (deletedToken == null) return NotFound();

            return Ok(mapper.Map<PersonalAccessTokenDTO>(deletedToken));
        }

        [HttpGet]
        [Route("token-type")]
        public IActionResult GetTokenType()
        {
            var authScheme = User.Identity?.AuthenticationType;

            var tokenType = authScheme;

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return Ok(new { TokenType = tokenType, UserId = userId });
        }
    }    
}
