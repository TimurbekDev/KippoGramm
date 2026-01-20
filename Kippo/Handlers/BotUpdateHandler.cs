using Kippo.Contexs;
using Kippo.Middleware;
using Kippo.Routers;
using Kippo.SessionStorage;

namespace Kippo.Handlers;

public abstract class BotUpdateHandler : IBotUpdateHandler
{
    private readonly CommandRouter _commandRouter;
    private readonly ISessionStore _sessionStore;

    protected BotUpdateHandler(ISessionStore sessionStore, IEnumerable<IBotMiddleware> middlewares)
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