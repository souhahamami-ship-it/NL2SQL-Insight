public class DepartmentsService
{
    private readonly IHttpClientFactory _factory;

    public DepartmentsService(
        IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<string> GetDepartments()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync(
            "http://localhost:8000/departments"
        );

        return await response.Content.ReadAsStringAsync();
    }
}