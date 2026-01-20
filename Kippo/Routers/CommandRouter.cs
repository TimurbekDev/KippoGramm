using Kippo.Attribute;
using Kippo.Contexs;
using Kippo.Middleware;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Kippo.Routers;

public class CommandRouter
{
    private record HandlerInfo(MethodInfo Method, object Instance);
    private readonly Dictionary<string, HandlerInfo> _commandHandlers = new(StringComparer.OrdinalIgnoreCase);
    private readonly List<(CallbackQueryAttribute Attr, HandlerInfo Handler)> _callbackHandlers = new();
    private readonly List<(TextAttribute Attr, HandlerInfo Handler)> _textHandlers = new();
    private readonly List<IBotMiddleware> _middlewares = new();

    public CommandRouter(object handlerInstance)
    {
        RegisterHandlers(handlerInstance);
    }

    public void Use(IBotMiddleware middleware)
    {
        _middlewares.Add(middleware);
    }

    private void RegisterHandlers(object instance)
    {
        var type = instance.GetType();
        var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance);

        foreach (var method in methods)
        {
            var handlerInfo = new HandlerInfo(method, instance);

            foreach (var cmdAttr in method.GetCustomAttributes<CommandAttribute>())
            {
                _commandHandlers[cmdAttr.Command] = handlerInfo;
            }

            foreach (var cbAttr in method.GetCustomAttributes<CallbackQueryAttribute>())
            {
                _callbackHandlers.Add((cbAttr, handlerInfo));
            }

            var textAttr = method.GetCustomAttribute<TextAttribute>();
            if (textAttr != null)
            {
                _textHandlers.Add((textAttr, handlerInfo));
            }
        }
    }
    public async Task<bool> RouteAsync(Context context)
    {
        var index = -1;

        async Task<bool> Next()
        {
            index++;

            if (index < _middlewares.Count)
            {
                bool handled = false;

                await _middlewares[index].InvokeAsync(
                    context,
                    async () =>
                    {
                        handled = await Next();
                    }
                );

                return handled;
            }

            return await RouteInternalAsync(context);
        }

        return await Next();
    }

    public async Task<bool> RouteInternalAsync(Context context)
    {
        var update = context.Update;

        if (update.Type == UpdateType.Message && update.Message?.Text?.StartsWith("/") == true)
        {
            var commandText = update.Message.Text.Split(' ')[0].TrimStart('/');
            var atIndex = commandText.IndexOf('@');
            if (atIndex > 0)
            {
                commandText = commandText[..atIndex];
            }

            if (_commandHandlers.TryGetValue(commandText, out var cmdHandler))
            {
                await InvokeHandlerAsync(cmdHandler, context);
                return true;
            }
        }

        if (update.Type == UpdateType.CallbackQuery)
        {
            var callbackData = update.CallbackQuery?.Data;
            foreach (var (attr, handler) in _callbackHandlers)
            {
                if (attr.Matches(callbackData))
                {
                    await InvokeHandlerAsync(handler, context);
                    return true;
                }
            }
        }

        if (update.Type == UpdateType.Message && !string.IsNullOrEmpty(update.Message?.Text)
            && !update.Message.Text.StartsWith("/"))
        {
            foreach (var (attr, handler) in _textHandlers.OrderBy(h => h.Attr.Priority))
            {
                if (attr.State != null && !string.Equals(context.Session?.State, attr.State, StringComparison.Ordinal))
                {
                    continue;
                }

                if (!IsTextMatch(attr, update.Message!.Text!))
                    continue;

                await InvokeHandlerAsync(handler, context);
                return true;
            }
        }

        return false;
    }

    private async Task InvokeHandlerAsync(HandlerInfo handler, Context context)
    {
        var botClient = context.BotClient;
        var update = context.Update;
        var cancellationToken = context.CancellationToken;
        var parameters = handler.Method.GetParameters();
        var args = new object?[parameters.Length];

        for (int i = 0; i < parameters.Length; i++)
        {
            var param = parameters[i];
            if (param.ParameterType == typeof(ITelegramBotClient))
                args[i] = botClient;
            else if (param.ParameterType == typeof(Update))
                args[i] = update;
            else if (param.ParameterType == typeof(CancellationToken))
                args[i] = cancellationToken;
            else if (param.ParameterType == typeof(Message))
                args[i] = update.Message;
            else if (param.ParameterType == typeof(CallbackQuery))
                args[i] = update.CallbackQuery;
            else if (param.ParameterType == typeof(Context))
                args[i] = context;
            else
                args[i] = param.HasDefaultValue ? param.DefaultValue : null;
        }

        var result = handler.Method.Invoke(handler.Instance, args);

        if (result is Task task)
        {
            await task;
        }
    }

    private static bool IsTextMatch(TextAttribute attr, string text)
    {
        if (attr.Pattern != null)
            return string.Equals(text, attr.Pattern, StringComparison.OrdinalIgnoreCase);

        if (attr.Contains != null)
            return text.Contains(attr.Contains, StringComparison.OrdinalIgnoreCase);

        if (attr.Regex != null)
            return Regex.IsMatch(text, attr.Regex, RegexOptions.IgnoreCase);

        return true;
    }
}