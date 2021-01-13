using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public LikesRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(u => u.Username).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (likesParams.Predicate == "liked")
            {
                likes = likes.Where(l => l.SourceUserId == likesParams.UserId);
                users = likes.Select(l => l.LikedUser);
            }

            if (likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(l => l.LikedUserId == likesParams.UserId);
                users = likes.Select(l => l.SourceUser);
            }

            // return await users.Select(u => new LikeDto
            // {
            //     Username = u.Username,
            //     KnownAs = u.KnownAs,
            //     Age = u.DateOfBirth.CalculateAge(),
            //     PhotoUrl = u.Photos.FirstOrDefault(p => p.IsMain).Url,
            //     City = u.City,
            //     Id = u.Id
            // }).ToListAsync();

            var likedUsers = users.ProjectTo<LikeDto>(_mapper.ConfigurationProvider);

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber,
                likesParams.PageSize);
        }

        public async Task<User> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(u => u.LikedUsers)
                .SingleOrDefaultAsync(u => u.Id == userId);
        }
    }
}