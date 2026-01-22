using Kippo.Contexs;
using Kippo.Middleware;
using Kippo.Routers;
using Kippo.SessionStorage;

namespace Kippo.Handlers;

public abstract class BotUpdateHandler : IBotUpdateHandler
{
    private CommandRouter? _commandRouter;
    private ISessionStore? _sessionStore;

    protected BotUpdateHandler()
    {
    }

    protected BotUpdateHandler(ISessionStore sessionStore, IEnumerable<IBotMiddleware> middlewares)
    {
        Initialize(sessionStore, middlewares);
    }

    internal void Initialize(ISessionStore sessionStore, IEnumerable<IBotMiddleware> middlewares)
    {
        _sessionStore = sessionStore;
        _commandRouter = new CommandRouter(this);

        foreach (IBotMiddleware middleware in middlewares)
        {
            _commandRouter.Use(middleware);
        }
    }

    public async Task HandleUpdateAsync(
        ITelegramBotClient botClient,
        Update update,
        CancellationToken cancellationToken)
    {
        if (_commandRouter == null || _sessionStore == null)
            throw new InvalidOperationException("Handler not initialized. This should not happen if registered via AddKippo.");

        var context = new Context(botClient, update, cancellationToken, _sessionStore);
        await _commandRouter.RouteAsync(context);
    }

    public Task HandleErrorAsync(
        ITelegramBotClient botClient,
        Exception exception,
        CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}