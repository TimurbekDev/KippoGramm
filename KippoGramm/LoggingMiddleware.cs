using Kippo.Contexs;
using Kippo.Middleware;

namespace KippoGramm;

/// <summary>
/// Example middleware that logs incoming updates and processing time
/// </summary>
public class LoggingMiddleware : IBotMiddleware
{
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(ILogger<LoggingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        var userId = context.Update.Message?.From?.Id ?? 
                    context.Update.CallbackQuery?.From?.Id ?? 
                    0;
        
        var username = context.Update.Message?.From?.Username ?? 
                      context.Update.CallbackQuery?.From?.Username ?? 
                      "Unknown";

        _logger.LogInformation(
            "📨 Update received from @{Username} (ID: {UserId}): {UpdateType}",
            username,
            userId,
            context.Update.Type
        );

        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        await next(); // Continue to next middleware or handler
        
        stopwatch.Stop();

        _logger.LogInformation(
            "✅ Update processed in {ElapsedMs}ms",
            stopwatch.ElapsedMilliseconds
        );
    }
}
