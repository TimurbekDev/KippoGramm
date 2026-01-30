using Kippo.Handlers;
using Kippo.Handlers.OptionalHanlers;
using Kippo.Localization;
using Kippo.Middleware;
using Kippo.Services;
using Kippo.SessionStorage;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;


namespace Kippo.Extensions;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddKippo<THandler>(
        this IServiceCollection services,
        IConfiguration configuration,
        bool languageAsker = false,
        IEnumerable<string>? supportedLanguages = null) 
        where THandler : class, IBotUpdateHandler
    {
        var botToken = configuration.GetSection("Kippo")["BotToken"]
            ?? throw new InvalidOperationException("Kippo:BotToken configuration is required.");

        AddBotClient(services, configuration);
        services.AddSingleton<ISessionStore,InMemorySessionStore>();
        services.AddSingleton<IBotUpdateHandler>(sp =>
        {
            var localizer = sp.GetService<IStringLocalizer<SharedResource>>();
            var handler = ActivatorUtilities.CreateInstance<THandler>(sp);
            
            if (handler is BotUpdateHandler botHandler)
            {
                var sessionStore = sp.GetRequiredService<ISessionStore>();
                var middlewares = sp.GetServices<IBotMiddleware>();
                var loggerFactory = sp.GetService<ILoggerFactory>();
                var logger = loggerFactory?.CreateLogger(typeof(THandler));
                
                botHandler.Initialize(sessionStore, middlewares, logger, sp, localizer);
            }
            
            return handler;
        });
        
        services.AddSingleton<BotUpdateHandlerAdapter>();
        services.AddHostedService<BotBackgroundService>();

        if (!languageAsker) return services;
        {
            var langs = supportedLanguages?.ToArray() ?? new[] { "en-US", "fr-FR" };
            services.AddSingleton<IBotMiddleware>(sp =>
            {
                var sessionStore = sp.GetRequiredService<ISessionStore>();
                return new DefaultHandlers(sessionStore, langs);
            });
        }

        return services;
    }

    private static void AddBotClient(IServiceCollection services, IConfiguration configuration)
    {
        if (services.Any(s => s.ServiceType == typeof(ITelegramBotClient)))
            return;

        var botToken = configuration.GetSection("Kippo")["BotToken"]
            ?? throw new InvalidOperationException("Kippo:BotToken configuration is required.");

        services.AddSingleton<ITelegramBotClient>(new TelegramBotClient(botToken));
        services.AddSingleton<TelegramBotClient>(sp => (TelegramBotClient)sp.GetRequiredService<ITelegramBotClient>());
    }

    public static IServiceCollection AddKippoLocalization(
        this IServiceCollection services,
        IEnumerable<string> supportedLocales,
        string? defaultLocale = null)
    {
        services.AddLocalization();
        var locales = SupportedLocales.Locales.ToArray();
        var defaultCulutre = defaultLocale ?? locales.FirstOrDefault() ?? "en-Us";

        services.Configure<RequestLocalizationOptions>(options =>
        {
            options.DefaultRequestCulture = new RequestCulture(defaultCulutre);
            options.AddSupportedCultures(locales);
            options.AddSupportedUICultures(locales);
        });

        return services;
    }
}
