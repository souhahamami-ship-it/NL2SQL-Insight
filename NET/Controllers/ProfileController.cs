using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace NET.Controllers
{
    [ApiController]
    [Route("profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetProfile()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var fullName = User.FindFirst("FullName")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                Username = username,
                FullName = fullName,
                Role = role
            });
        } // Closing GetProfile method properly

        [Authorize(Roles = "Admin")]
[HttpGet("admin")]
public IActionResult AdminOnly()
{
    return Ok(new
    {
        Message = "Welcome Admin!",
        User = User.Identity?.Name
    });
}
    }
}