using Kippo.Handlers;
using Kippo.Services;
using Kippo.SessionStorage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace Kippo.Extensions;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddKippo<THandler>(this IServiceCollection services,IConfiguration configuration) where THandler : class, IBotUpdateHandler
    {
        var botToken = configuration.GetSection("Kippo")["BotToken"]
            ?? throw new InvalidOperationException("Kippo:BotToken configuration is required.");

        AddBotClient(services, configuration);
        services.AddSingleton<IBotUpdateHandler, THandler>();
        services.AddSingleton<ISessionStore,InMemorySessionStore>();
        services.AddSingleton<BotUpdateHandlerAdapter>();
        services.AddHostedService<BotBackgroundService>();
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
}
