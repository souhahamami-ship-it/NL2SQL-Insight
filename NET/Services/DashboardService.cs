public class DashboardService
{
    private readonly HttpClient _httpClient;

    public DashboardService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GetDashboardAsync()
    {
        return await _httpClient.GetStringAsync("http://localhost:8000/dashboard");
    }
}