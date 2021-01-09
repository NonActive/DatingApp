using System;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userRepository = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();

            var userId = resultContext.HttpContext.User.GetUserId();
            var user = await userRepository.GetUserById(userId);
            user.LastActive = DateTime.Now;
            await userRepository.SaveAll();
        }
    }
}