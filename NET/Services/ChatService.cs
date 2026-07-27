using System.Net.Http.Json;

namespace NET.Services;

public class ChatService : IChatService
{
    private readonly IHttpClientFactory _factory;

    public ChatService(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<string> AskQuestion(string question)
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync(
            "http://localhost:8000/chat",
            new { question }
        );

        var content = await response.Content.ReadAsStringAsync();

        Console.WriteLine("========== FASTAPI RESPONSE ==========");
        Console.WriteLine(content);
        Console.WriteLine("======================================");

        return content;
    }
}