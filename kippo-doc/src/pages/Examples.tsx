import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const completeHandler = `using Kippo.Attribute;
using Kippo.Contexs;
using Kippo.Handlers;
using Kippo.Keyboard;

public class MyHandler : BotUpdateHandler
{
    [Command("start")]
    public async Task Start(Context context, IUserService userService)
    {
        var keyboard = ReplyKeyboardBuilder.Create()
            .Button("📝 Register")
            .Button("ℹ️ Info")
            .Row()
            .Button("❓ Help")
            .Resize()
            .Build();

        await context.Reply(
            "🤖 *Welcome to Kippo Demo Bot!*\\n\\n" +
            "Choose an option to get started:",
            keyboard
        );
    }

    [Command("help")]
    [Text(Pattern = "❓ Help")]
    public async Task Help(Context context)
    {
        await context.Reply(
            "📚 *Available Commands*\\n\\n" +
            "/start - Show main menu\\n" +
            "/help - Show this message\\n" +
            "/register - Start registration\\n" +
            "/info - Show your info\\n" +
            "/menu - Show inline menu"
        );
    }

    [Command("register")]
    [Text(Pattern = "📝 Register")]
    public async Task StartRegistration(Context context)
    {
        context.Session!.State = "ask_age";

        var keyboard = ReplyKeyboardBuilder.Create()
            .Button("Cancel ❌")
            .Resize()
            .OneTime()
            .Build();

        await context.Reply(
            "👤 *Let's get you registered!*\\n\\n" +
            "Please enter your age:",
            keyboard
        );
    }

    [Text(State = "ask_age")]
    public async Task AskAge(Context context)
    {
        var text = context.Message.Text;

        if (text == "Cancel ❌")
        {
            await Cancel(context);
            return;
        }

        if (!int.TryParse(text, out var age) || age < 13 || age > 120)
        {
            await context.Reply("❌ Please enter a valid age (13-120).");
            return;
        }

        context.Session!.Data["age"] = age;
        context.Session!.State = "ask_name";

        await context.Reply("✅ Great! Now, what's your name?");
    }

    [Text(State = "ask_name")]
    public async Task AskName(Context context)
    {
        var name = context.Message.Text;

        if (string.IsNullOrWhiteSpace(name) || name.Length < 2)
        {
            await context.Reply("❌ Please enter a valid name (at least 2 characters).");
            return;
        }

        context.Session!.Data["name"] = name;
        context.Session!.State = "ask_country";

        var keyboard = InlineKeyboardBuilder.Create()
            .Button("🇺🇸 USA", "country_usa")
            .Button("🇬🇧 UK", "country_uk")
            .Row()
            .Button("🇩🇪 Germany", "country_de")
            .Button("🇫🇷 France", "country_fr")
            .Row()
            .Button("🌍 Other", "country_other")
            .Build();

        await context.Reply(
            $"Nice to meet you, {name}! 👋\\n\\n" +
            "Where are you from?",
            keyboard
        );
    }

    [CallbackQuery("country_*")]
    public async Task HandleCountry(Context context)
    {
        var country = context.Update.CallbackQuery!.Data!.Replace("country_", "").ToUpper();
        var countryName = country switch
        {
            "USA" => "🇺🇸 United States",
            "UK" => "🇬🇧 United Kingdom",
            "DE" => "🇩🇪 Germany",
            "FR" => "🇫🇷 France",
            _ => "🌍 Other"
        };

        context.Session!.Data["country"] = countryName;
        context.Session!.State = null;

        var name = context.Session!.Data["name"];
        var age = context.Session!.Data["age"];

        await context.Callback.Answer();

        var keyboard = ReplyKeyboardBuilder.Create()
            .Button("📝 Register")
            .Button("ℹ️ Info")
            .Row()
            .Button("❓ Help")
            .Resize()
            .Build();

        await context.Reply(
            "🎉 *Registration Complete!*\\n\\n" +
            $"📋 Your Info:\\n" +
            $"• Name: {name}\\n" +
            $"• Age: {age}\\n" +
            $"• Country: {countryName}",
            keyboard
        );
    }

    [Command("info")]
    [Text(Pattern = "ℹ️ Info")]
    public async Task ShowInfo(Context context)
    {
        if (context.Session?.Data.ContainsKey("name") != true)
        {
            await context.Reply(
                "❌ You haven't registered yet!\\n\\n" +
                "Use /register to get started."
            );
            return;
        }

        var name = context.Session!.Data["name"];
        var age = context.Session!.Data["age"];
        var country = context.Session!.Data.GetValueOrDefault("country", "Not set");

        await context.Reply(
            "📋 *Your Information*\\n\\n" +
            $"• Name: {name}\\n" +
            $"• Age: {age}\\n" +
            $"• Country: {country}"
        );
    }

    [Command("menu")]
    public async Task ShowInlineMenu(Context context)
    {
        var keyboard = InlineKeyboardBuilder.Create()
            .Button("✅ Option 1", "opt_1")
            .Button("✅ Option 2", "opt_2")
            .Row()
            .Button("⚙️ Settings", "settings")
            .Row()
            .UrlButton("📖 Documentation", "https://github.com")
            .Build();

        await context.Reply(
            "🔘 *Inline Menu*\\n\\n" +
            "Choose an option:",
            keyboard
        );
    }

    [CallbackQuery("opt_*")]
    public async Task HandleOption(Context context)
    {
        var option = context.Update.CallbackQuery!.Data!.Replace("opt_", "");
        await context.Callback.Answer($"You selected Option {option}");
        await context.Reply($"✅ You selected Option {option}!");
    }

    [CallbackQuery("settings")]
    public async Task HandleSettings(Context context)
    {
        var keyboard = InlineKeyboardBuilder.Create()
            .Button("🔔 Notifications", "set_notif")
            .Button("🌐 Language", "set_lang")
            .Row()
            .Button("🔙 Back", "back_menu")
            .Build();

        await context.Reply(
            "⚙️ *Settings*\\n\\n" +
            "Configure your preferences:",
            keyboard
        );
    }

    [CallbackQuery("back_menu")]
    public async Task BackToMenu(Context context)
    {
        await context.Callback.Answer();
        await ShowInlineMenu(context);
    }

    [Text(Pattern = "Cancel ❌")]
    public async Task Cancel(Context context)
    {
        context.Session!.State = null;
        context.Session!.Data.Clear();

        var keyboard = ReplyKeyboardBuilder.Create()
            .Button("📝 Register")
            .Button("ℹ️ Info")
            .Row()
            .Button("❓ Help")
            .Resize()
            .Build();

        await context.Reply("❌ Operation cancelled.", keyboard);
    }

    [Text]
    public async Task GlobalTextHandler(Context context)
    {
        await context.Reply(
            $"📝 You said: _{context.Message.Text}_\\n\\n" +
            "Use /help to see available commands."
        );
    }
}`;

const programCs = `using Kippo.Extensions;
using Kippo.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddSingleton<IUserService, UserService>();

// Register Kippo with middleware
builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<LoggingMiddleware>()
                .AddKippoMiddleware<SessionMiddleware>();

var app = builder.Build();
app.Run();`;

const loggingMiddlewareExample = `using Kippo.Contexs;
using Kippo.Middleware;

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
                    context.Update.CallbackQuery?.From?.Id ?? 0;
        
        var username = context.Update.Message?.From?.Username ?? 
                      context.Update.CallbackQuery?.From?.Username ?? 
                      "Unknown";

        _logger.LogInformation(
            "📨 Update from @{Username} (ID: {UserId}): {UpdateType}",
            username, userId, context.Update.Type
        );

        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        await next();
        
        stopwatch.Stop();

        _logger.LogInformation(
            "✅ Processed in {ElapsedMs}ms",
            stopwatch.ElapsedMilliseconds
        );
    }
}`;

const userServiceExample = `public interface IUserService
{
    Task<string?> GetUserName(long id);
    Task SetUserName(long id, string name);
}

public class UserService : IUserService
{
    private readonly Dictionary<long, string> _users = new();

    public Task<string?> GetUserName(long id)
    {
        _users.TryGetValue(id, out var name);
        return Task.FromResult(name);
    }

    public Task SetUserName(long id, string name)
    {
        _users[id] = name;
        return Task.CompletedTask;
    }
}`;

const appSettings = `{
  "Kippo": {
    "BotToken": "YOUR_BOT_TOKEN_HERE"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}`;

const echoBot = `using Kippo.Attribute;
using Kippo.Contexs;
using Kippo.Handlers;

public class EchoHandler : BotUpdateHandler
{
    [Command("start")]
    public async Task Start(Context context)
    {
        await context.Reply("Hi! I'm an echo bot. Send me any message!");
    }

    [Text]
    public async Task Echo(Context context)
    {
        await context.Reply($"You said: {context.Message.Text}");
    }
}`;

const pollBot = `using Kippo.Attribute;
using Kippo.Contexs;
using Kippo.Handlers;
using Kippo.Keyboard;

public class PollHandler : BotUpdateHandler
{
    [Command("poll")]
    public async Task CreatePoll(Context context)
    {
        context.Session!.State = "poll_question";
        context.Session.Data["votes"] = new Dictionary<string, int>();
        
        await context.Reply("📊 Let's create a poll!\\n\\nWhat's your question?");
    }

    [Text(State = "poll_question")]
    public async Task SetQuestion(Context context)
    {
        context.Session!.Data["question"] = context.Message.Text;
        context.Session.State = "poll_options";
        context.Session.Data["options"] = new List<string>();
        
        await context.Reply(
            "Great! Now send me the options one by one.\\n" +
            "Send /done when finished."
        );
    }

    [Text(State = "poll_options")]
    public async Task AddOption(Context context)
    {
        var options = (List<string>)context.Session!.Data["options"];
        options.Add(context.Message.Text);
        
        await context.Reply($"✅ Added: {context.Message.Text}\\n\\nSend more or /done");
    }

    [Command("done")]
    public async Task FinishPoll(Context context)
    {
        if (context.Session?.State != "poll_options") return;
        
        var question = (string)context.Session.Data["question"];
        var options = (List<string>)context.Session.Data["options"];
        
        context.Session.State = null;
        
        var builder = InlineKeyboardBuilder.Create();
        for (int i = 0; i < options.Count; i++)
        {
            builder.Button(options[i], $"vote_{i}");
            if (i < options.Count - 1) builder.Row();
        }
        
        await context.Reply($"📊 *{question}*", builder.Build());
    }

    [CallbackQuery("vote_*")]
    public async Task HandleVote(Context context)
    {
        var optionIndex = context.Callback.Data.Replace("vote_", "");
        await context.Callback.Answer($"You voted for option {optionIndex}!");
    }
}`;

export function Examples() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Examples</h1>
        <p className="text-xl text-zinc-400">
          Complete working examples to help you get started with Kippo. 
          These examples demonstrate real-world bot patterns.
        </p>
      </div>

      {/* KippoGramm Example */}
      <section className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">KippoGramm - Complete Demo Bot</h2>
            <p className="text-zinc-400 mt-2">
              A full-featured demo bot showcasing all Kippo features including registration flow, 
              session management, keyboards, and middleware.
            </p>
          </div>
          <a
            href="https://github.com/TimurbekDev/KippoGramm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
          >
            <ExternalLink size={16} />
            View on GitHub
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
            <p className="text-2xl font-bold text-blue-400">5</p>
            <p className="text-zinc-500 text-sm">Commands</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
            <p className="text-2xl font-bold text-green-400">3</p>
            <p className="text-zinc-500 text-sm">Step Registration</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
            <p className="text-2xl font-bold text-purple-400">2</p>
            <p className="text-zinc-500 text-sm">Keyboard Types</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
            <p className="text-2xl font-bold text-yellow-400">2</p>
            <p className="text-zinc-500 text-sm">Middleware</p>
          </div>
        </div>
      </section>

      {/* Project Structure */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Project Structure</h2>
        <CodeBlock 
          code={`KippoGramm/
├── Program.cs              # Application setup & DI
├── MyHandler.cs            # Bot command handlers
├── LoggingMiddleware.cs    # Custom logging middleware
├── UserService.cs          # Example service
├── appsettings.json        # Configuration
└── appsettings.Development.json`}
          language="plaintext"
          filename="Project Structure"
        />
      </section>

      {/* Configuration */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Configuration</h2>
        <CodeBlock code={appSettings} language="json" filename="appsettings.json" />
      </section>

      {/* Program.cs */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Program.cs</h2>
        <CodeBlock code={programCs} language="csharp" filename="Program.cs" />
      </section>

      {/* Handler */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Complete Handler</h2>
        <p className="text-zinc-400 mb-6">
          Full handler with registration flow, inline menus, and session management:
        </p>
        <CodeBlock code={completeHandler} language="csharp" filename="MyHandler.cs" />
      </section>

      {/* Logging Middleware */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Logging Middleware</h2>
        <CodeBlock code={loggingMiddlewareExample} language="csharp" filename="LoggingMiddleware.cs" />
      </section>

      {/* User Service */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Example Service</h2>
        <CodeBlock code={userServiceExample} language="csharp" filename="UserService.cs" />
      </section>

      {/* Simple Examples */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Simple Examples</h2>
        
        <h3 className="text-xl font-semibold text-white mb-4">Echo Bot</h3>
        <p className="text-zinc-400 mb-4">
          The simplest possible bot - echoes back any message:
        </p>
        <CodeBlock code={echoBot} language="csharp" filename="EchoHandler.cs" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Poll Bot</h3>
        <p className="text-zinc-400 mb-4">
          Create simple polls with inline keyboards:
        </p>
        <CodeBlock code={pollBot} language="csharp" filename="PollHandler.cs" />
      </section>

      {/* Features Demonstrated */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Features Demonstrated</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Routing</h4>
            <ul className="text-zinc-400 text-sm space-y-1">
              <li>• [Command] for /start, /help, etc.</li>
              <li>• [Text] for button text matching</li>
              <li>• [Text(State)] for state-specific handlers</li>
              <li>• [CallbackQuery] with wildcards</li>
              <li>• Multiple attributes per handler</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-400 mb-2">Sessions</h4>
            <ul className="text-zinc-400 text-sm space-y-1">
              <li>• Multi-step registration flow</li>
              <li>• State management</li>
              <li>• Data persistence</li>
              <li>• Cancel/reset functionality</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-400 mb-2">Keyboards</h4>
            <ul className="text-zinc-400 text-sm space-y-1">
              <li>• Reply keyboards with buttons</li>
              <li>• Inline keyboards with callbacks</li>
              <li>• URL buttons</li>
              <li>• Dynamic keyboard building</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">Advanced</h4>
            <ul className="text-zinc-400 text-sm space-y-1">
              <li>• Custom middleware</li>
              <li>• Dependency injection</li>
              <li>• Service integration</li>
              <li>• Logging</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Run Instructions */}
      <section className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <h2 className="text-xl font-semibold text-white mb-4">Run the Example</h2>
        <CodeBlock 
          code={`# Clone the repository
git clone https://github.com/TimurbekDev/KippoGramm.git
cd KippoGramm/KippoGramm

# Add your bot token to appsettings.json

# Run the bot
dotnet run`}
          language="bash"
          filename="Terminal"
        />
      </section>

      {/* Navigation */}
      <section className="flex gap-4">
        <Link
          to="/configuration"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Configuration</p>
          </div>
        </Link>
        <Link
          to="/"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-blue-600 hover:bg-blue-700 border border-blue-500 transition-colors group"
        >
          <div>
            <span className="text-blue-200 text-sm">Back to</span>
            <p className="text-white font-medium">Home</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
