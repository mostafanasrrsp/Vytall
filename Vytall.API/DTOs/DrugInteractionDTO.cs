namespace Vytall.API.DTOs
{
    public class DrugInteractionRequestDTO
    {
        public List<string> Drugs { get; set; }
    }

    public class DrugInteractionResultDTO
    {
        public List<DrugInteractionDTO> Interactions { get; set; }
    }

    public class DrugInteractionDTO
    {
        public List<string> Drugs { get; set; }
        public string Severity { get; set; }
        public string Description { get; set; }
    }
} 