using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace MedConnect.API.Data
{
    public class MedConnectContextFactory : IDesignTimeDbContextFactory<MedConnectContext>
    {
        public MedConnectContext CreateDbContext(string[] args)
        {
            // Build configuration
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var builder = new DbContextOptionsBuilder<MedConnectContext>();

            // Use the same connection string from appsettings.json
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            builder.UseSqlServer(connectionString);

            return new MedConnectContext(builder.Options);
        }
    }
}