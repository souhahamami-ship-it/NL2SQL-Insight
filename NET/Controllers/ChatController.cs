using Microsoft.AspNetCore.Mvc;
using NET.Services;

namespace NET.Controllers;

[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(
        IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpGet]
    public async Task<IActionResult> Chat(
        string question)
    {
        var answer =
            await _chatService
                .AskQuestion(question);

        return Content(
            answer,
            "application/json"
        );
    }
}