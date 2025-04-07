using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MedConnect.API.Models;

namespace MedConnect.API.Controllers
{
    [ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private static List<User> _users = new List<User>
    {
        new User { Id = 1, Username = "physician1", PasswordHash = "somehash", Role = "Physician", PhysicianId = 1 },
        new User { Id = 2, Username = "admin1", PasswordHash = "anotherhash", Role = "Admin" },
        new User { Id = 3, Username = "pharmacist1", PasswordHash = "somehash", Role = "Pharmacist", PharmacistId = 1 },
        new User { Id = 4, Username = "patient1", PasswordHash = "somehash", Role = "Patient", PatientId = 2 },
        new User { Id = 5, Username = "facility1", PasswordHash = "somehash", Role = "Facility", FacilityId = 1 }
    };

    private readonly IConfiguration _config;

    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    // POST api/auth/login
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // 1. Find user in in-memory list
        var user = _users.SingleOrDefault(u => u.Username == request.Username);
        if (user == null) return Unauthorized("User not found.");

        // 2. Check password (plain compare for now)
        if (user.PasswordHash != request.Password)
            return Unauthorized("Invalid password.");

        // 3. Generate a minimal JWT
        var token = GenerateJwtToken(user);

        // 4. Return token + role + optional IDs
        return Ok(new
        {
            token,
            role = user.Role,
            username = user.Username,
            patientId = user.PatientId,
            physicianId = user.PhysicianId,
            pharmacistId = user.PharmacistId,
            facilityId = user.FacilityId
        });
    }

   private string GenerateJwtToken(User user)
{
    var secretKey = _config["JwtSettings:SecretKey"];
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Username),
        new Claim("role", user.Role),
    };

    if (user.PatientId.HasValue)
        claims.Add(new Claim("patientId", user.PatientId.Value.ToString()));

    if (user.PhysicianId.HasValue)
        claims.Add(new Claim("physicianId", user.PhysicianId.Value.ToString()));

    if (user.PharmacistId.HasValue)
        claims.Add(new Claim("pharmacistId", user.PharmacistId.Value.ToString()));

    if (user.FacilityId.HasValue)
        claims.Add(new Claim("facilityId", user.FacilityId.Value.ToString()));

    var token = new JwtSecurityToken(
        issuer: "MedConnect",
        audience: "MedConnect",
        claims: claims,
        expires: DateTime.UtcNow.AddHours(2),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

public class LoginRequest
{
    public string Username { get; set; } = default!;
    public string Password { get; set; } = default!;
}
}
}