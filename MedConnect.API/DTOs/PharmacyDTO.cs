namespace MedConnect.API.DTOs
{
    public class PharmacyDTO
    {
        public int PharmacyId { get; set; }
        public string PharmacyName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Email { get; set; }  = string.Empty; 
        public string Phone { get; set; } = string.Empty;
    }
}