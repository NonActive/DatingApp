using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DatingApp.API.Data
{
    public static class DataContextExtension
    {
        // Check if all migrations are applied
        public static bool AllMigrationsApplied(this DbContext context)
        {
            var applied = context.GetService<IHistoryRepository>()
            .GetAppliedMigrations()
            .Select(m => m.MigrationId);

            var total = context.GetService<IMigrationsAssembly>()
            .Migrations
            .Select(m => m.Key);

            return !total.Except(applied).Any();
        }
    }
}