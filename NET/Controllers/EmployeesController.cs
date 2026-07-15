using Microsoft.AspNetCore.Mvc;
using NET.Services;
namespace NET.Controllers;

[ApiController]
[Route("employees")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeesController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        var employees = await _employeeService.GetEmployees();

        return Ok(employees);
    }

    [HttpGet("{id}")]
public async Task<IActionResult> GetEmployeeDetail(int id)
{
    var employee =
        await _employeeService.GetEmployeeDetail(id);

    return Content(
        employee,
        "application/json"
    );
}
    [HttpGet("details")]
public async Task<IActionResult> GetEmployeeDetails()
{
    var employees =
        await _employeeService.GetEmployeeDetails();

    return Content(
        employees,
        "application/json"
    );
}
}