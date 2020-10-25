using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IUserRepository
    {
        void Add<T>(T entity) where T: class;
        void Remove<T>(T entity) where T: class;
        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUserById(int id);        
        Task<User> GetUserByUsername(string username);        
        
        Task<IEnumerable<MemberDto>> GetMembers();
        Task<MemberDto> GetMember(string username);
        Task<bool> SaveAll();
        void Update(User user);
    }
}