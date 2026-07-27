using Microsoft.AspNetCore.Mvc;
using NET.Services;

namespace NET.Controllers;


public class ChatRequest
{
    public string Question { get; set; } = "";
}

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

    [HttpPost]
public async Task<IActionResult> Chat([FromBody] ChatRequest request)
{
    var answer = await _chatService.AskQuestion(request.Question);

    return Content(answer, "application/json");
}
}