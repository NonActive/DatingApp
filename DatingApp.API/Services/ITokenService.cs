using DatingApp.API.Models;

namespace DatingApp.API.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}