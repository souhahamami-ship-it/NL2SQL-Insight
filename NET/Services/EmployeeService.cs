
using NET.Services;
namespace NET.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IHttpClientFactory _factory;

    public EmployeeService(
        IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<string> GetEmployees()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync(
            "http://localhost:8000/employees"
        );

        return await response.Content
            .ReadAsStringAsync();
    }

    public async Task<string> GetEmployeeDetail(int id)
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync(
            $"http://localhost:8000/employees/{id}"
        );

        return await response.Content
            .ReadAsStringAsync();
    }

    public async Task<string> GetEmployeeDetails()
{
    var client = _factory.CreateClient();

    var response = await client.GetAsync(
        "http://localhost:8000/employee-details"
    );

    return await response.Content
        .ReadAsStringAsync();
}
}