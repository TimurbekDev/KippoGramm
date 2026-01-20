using Kippo.Handlers;
using Microsoft.Extensions.Hosting;

namespace Kippo.Services;

public class BotBackgroundService(ITelegramBotClient botClient, BotUpdateHandlerAdapter updateHandler) : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        botClient.StartReceiving(updateHandler: updateHandler,
            receiverOptions:new(),
            cancellationToken: stoppingToken);

        return Task.CompletedTask;
    }
}
