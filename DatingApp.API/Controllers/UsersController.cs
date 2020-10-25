using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepo, IMapper mapper)
        {
            _mapper = mapper;
            _userRepo = userRepo;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepo.GetMembers();

            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepo.GetMember(username);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepo.GetUserByUsername(username);
            _mapper.Map(memberUpdateDto, user);

            _userRepo.Update(user);

            if (await _userRepo.SaveAll())
                return NoContent();

            return BadRequest($"Updating user failed on save");
        }


    }
}