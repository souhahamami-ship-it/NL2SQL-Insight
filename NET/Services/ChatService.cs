using System.Net;

namespace NET.Services;

public class ChatService : IChatService
{
    private readonly IHttpClientFactory _factory;

    public ChatService(
        IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<string> AskQuestion(
        string question)
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync(
            $"http://localhost:8000/chat?question={WebUtility.UrlEncode(question)}"
        );

        return await response.Content
            .ReadAsStringAsync();
    }
}