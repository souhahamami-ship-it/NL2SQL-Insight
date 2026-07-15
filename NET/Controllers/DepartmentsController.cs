using Microsoft.AspNetCore.Mvc;

namespace NET.Controllers;

[ApiController]
[Route("departments")]

public class DepartmentsController : ControllerBase
{
    private readonly DepartmentsService _departmentsService;

    public DepartmentsController(
        DepartmentsService departmentsService)
    {
        _departmentsService = departmentsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartments()
    {
        var departments =
            await _departmentsService.GetDepartments();

        return Ok(departments);
    }
}