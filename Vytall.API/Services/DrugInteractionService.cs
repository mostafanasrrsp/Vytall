using System.Text.Json;
using Vytall.API.DTOs;

namespace Vytall.API.Services
{
    public class DrugInteractionService
    {
        private readonly List<DrugInteractionDTO> _interactions;

        public DrugInteractionService(string dataFilePath)
        {
            var json = File.ReadAllText(dataFilePath);
            var doc = JsonDocument.Parse(json);
            _interactions = doc.RootElement.GetProperty("interactions")
                .EnumerateArray()
                .Select(e => new DrugInteractionDTO
                {
                    Drugs = e.GetProperty("drugs").EnumerateArray().Select(d => d.GetString()).ToList(),
                    Severity = e.GetProperty("severity").GetString(),
                    Description = e.GetProperty("description").GetString()
                })
                .ToList();
        }

        public List<DrugInteractionDTO> CheckInteractions(List<string> drugs)
        {
            var lowerDrugs = drugs.Select(d => d.ToLowerInvariant()).ToList();
            return _interactions.Where(interaction =>
                interaction.Drugs.All(drug => lowerDrugs.Contains(drug.ToLowerInvariant()))
            ).ToList();
        }
    }
} 