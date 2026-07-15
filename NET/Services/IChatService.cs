namespace NET.Services;

public interface IChatService
{
    Task<string> AskQuestion(string question);
}

