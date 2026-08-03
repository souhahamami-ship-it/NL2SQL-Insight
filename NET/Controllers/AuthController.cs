using Microsoft.AspNetCore.Mvc;
using NET.Models;
using NET.Services;

namespace NET.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _configuration;

        // Injected IConfiguration to safely access appsettings secrets
        public AuthController(
            UserService userService, 
            JwtService jwtService,
            IConfiguration configuration)
        {
            _userService = userService;
            _jwtService = jwtService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _userService.AuthenticateAsync(
                request.Username,
                request.Password);

            if (user == null)
            {
                return Unauthorized(new
                {
                    Message = "Invalid username or password."
                });
            }

            string token = _jwtService.GenerateToken(user);

            var response = new LoginResponse
            {
                Token = token,
                Username = user.Username,
                FullName = user.FullName,
                Role = user.Role
            };

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var expectedKey = _configuration["Registration:Key"];
            if (string.IsNullOrWhiteSpace(expectedKey))
{
    return StatusCode(500, new
    {
        Message = "Registration key is not configured."
    });
}

            if (request.RegistrationKey != expectedKey)
            {
                return Forbid();
            }

            bool success = await _userService.RegisterAsync(request);

            if (!success)
            {
                return Conflict(new
                {
                    Message = "Username already exists."
                });
            }

            return StatusCode(StatusCodes.Status201Created, new
            {
                Message = "User registered successfully."
            });
        }
    } // Properly closing the class here
}