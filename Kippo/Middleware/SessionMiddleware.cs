using Kippo.Contexs;

namespace Kippo.Middleware;

public class SessionMiddleware : IBotMiddleware
{
    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        context.Session = await context.SessionStore.GetAsync(context.ChatId);

        await next();

        await context.SessionStore.SaveAsync(context.ChatId, context.Session);
    }
}
