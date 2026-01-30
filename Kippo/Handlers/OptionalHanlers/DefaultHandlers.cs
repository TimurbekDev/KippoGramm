using System.Globalization;
using Kippo.Contexs;
using Kippo.Keyboard;
using Kippo.Middleware;
using Kippo.SessionStorage;

namespace Kippo.Handlers.OptionalHanlers;

public class DefaultHandlers(ISessionStore sessionStore, string[] languages) : IBotMiddleware
{

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        var session = await sessionStore.GetAsync(context.ChatId);
        if (string.IsNullOrWhiteSpace(session?.Language))
        {
            var builder = InlineKeyboardBuilder.Create();
            foreach ( var language in languages)
            {
                var (emoji, name) = GetEmojiAndName(language);
                builder.Button($"{emoji} {name}", $"lang_{language}");
            }
            
            var keyboard = builder.Build();
            await context.Reply("Please select your language:", keyboard);
        }
        else
        {
            var culture = new CultureInfo(session.Language);
            CultureInfo.CurrentCulture = culture;
            CultureInfo.CurrentUICulture = culture;
        }
        
        await next();
    }
        
    private static (string emoji, string name) GetEmojiAndName(string lang)
    {
        return lang switch
        {
            "en-US" => ("🇺🇸", "English"),
            "fr-FR" => ("🇫🇷", "Français"),
            "es-ES" => ("🇪🇸", "Español"),
            "de-DE" => ("🇩🇪", "Deutsch"),
            _ => ("🏳️", lang)
        };
    }
}