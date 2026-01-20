using Kippo.Attribute;
using Kippo.Contexs;
using Kippo.Handlers;
using Kippo.Keyboard;
using Kippo.Middleware;
using Kippo.SessionStorage;
using Telegram.Bot.Types.ReplyMarkups;

public class MyHandler : BotUpdateHandler
{
    public MyHandler(ISessionStore sessionStore, IEnumerable<IBotMiddleware> middlewares) : base(sessionStore, middlewares){}

    [Command("start")]
    public async Task Start(Context context)
    {
        context.Session?.State = "ask_age";

        var keyboard = ReplyKeyboardBuilder.Create()
            .Button("Cancel ❌")
            .Resize()
            .OneTime()
            .Build();

        await context.Reply(
            "Welcome! 👋\n" +
            "Please enter your age:",
            keyboard
        );
    }

    [Text(State = "ask_age")]
    public async Task AskAge(Context context)
    {
        if (!int.TryParse(context.Message.Text, out var age))
        {
            await context.Reply("❌ Please enter a valid number.");
            return;
        }

        context.Session?.Data["age"] = age;
        context.Session?.State = "ask_name";

        await context.Reply("Great 👍 Now enter your name:");
    }

    [Text(State = "ask_name")]
    public async Task AskName(Context context)
    {
        var name = context.Message.Text;

        context.Session?.Data["name"] = name;
        context.Session?.State = null;

        await context.Reply(
            $"✅ Saved!\n" +
            $"Name: {name}\n" +
            $"Age: {context.Session?.Data["age"]}",
            new ReplyKeyboardRemove()
        );
    }

    [Text(Pattern = "Cancel ❌")]
    public async Task Cancel(Context context)
    {
        context.Session?.State = null;
        context.Session?.Data.Clear();

        await context.Reply("❌ Cancelled.");
    }

    [Text(Pattern = "21")]
    public async Task GlobalTextHandler(Context context)
    {
        await context.Reply($"Pattern : {context.Message.Text}");
    }
}
