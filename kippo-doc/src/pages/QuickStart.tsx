import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const step1Code = `{
  "Kippo": {
    "BotToken": "YOUR_BOT_TOKEN_HERE"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}`;

const step2Code = `using Kippo.Attribute;
using Kippo.Contexs;
using Kippo.Handlers;
using Kippo.Keyboard;

public class MyBotHandler : BotUpdateHandler
{
    [Command("start")]
    public async Task Start(Context context)
    {
        var keyboard = ReplyKeyboardBuilder.Create()
            .Button("Say Hello")
            .Button("Help")
            .Resize()
            .Build();

        await context.Reply(
            "Welcome to my bot! Choose an option:",
            keyboard
        );
    }

    [Command("help")]
    [Text(Pattern = "Help")]
    public async Task Help(Context context)
    {
        await context.Reply(
            "Available Commands:\\n\\n" +
            "/start - Start the bot\\n" +
            "/help - Show this message"
        );
    }

    [Text(Pattern = "Say Hello")]
    public async Task SayHello(Context context)
    {
        var username = context.Update.Message?.From?.FirstName ?? "friend";
        await context.Reply($"Hello, {username}!");
    }

    [Text]
    public async Task HandleText(Context context)
    {
        await context.Reply($"You said: {context.Message.Text}");
    }
}`;

const step3Code = `using Kippo.Extensions;
using Kippo.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Register Kippo with your bot handler
builder.Services.AddKippo<MyBotHandler>(builder.Configuration)
                .AddKippoMiddleware<SessionMiddleware>();

var app = builder.Build();

app.Run();`;

const createProjectCode = `# Create a new ASP.NET Core project
dotnet new web -n MyTelegramBot

# Navigate to the project
cd MyTelegramBot

# Add Kippo package
dotnet add package Kippo`;

export function QuickStart() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Quick Start</h1>
        <p className="text-xl text-zinc-400">
          Get your Telegram bot running in under 5 minutes with this step-by-step guide.
        </p>
      </div>

      {/* Prerequisites */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="text-blue-500" size={20} />
          Prerequisites
        </h2>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-zinc-300">
            <CheckCircle2 className="text-green-500 flex-shrink-0" size={18} />
            <span>.NET 8.0, 9.0, or 10.0 SDK installed</span>
          </li>
          <li className="flex items-center gap-3 text-zinc-300">
            <CheckCircle2 className="text-green-500 flex-shrink-0" size={18} />
            <span>A Telegram Bot Token (get from <a href="https://t.me/botfather" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@BotFather</a>)</span>
          </li>
          <li className="flex items-center gap-3 text-zinc-300">
            <CheckCircle2 className="text-green-500 flex-shrink-0" size={18} />
            <span>Basic knowledge of C# and ASP.NET Core</span>
          </li>
        </ul>
      </section>

      {/* Get Bot Token */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            0
          </div>
          <h2 className="text-2xl font-bold text-white">Get Your Bot Token</h2>
        </div>
        
        <div className="pl-11 space-y-4">
          <p className="text-zinc-400">
            Before you start, you need a bot token from Telegram:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-300">
            <li>Open Telegram and search for <strong>@BotFather</strong></li>
            <li>Send <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">/newbot</code> command</li>
            <li>Follow the instructions to name your bot</li>
            <li>Copy the bot token (looks like <code className="px-2 py-1 rounded bg-zinc-800 text-green-400">123456789:ABCdefGHIjklMNOpqrsTUVwxyz</code>)</li>
          </ol>
          
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-yellow-200 text-sm">
              <strong>Important:</strong> Keep your bot token secret! Never commit it to public repositories.
            </p>
          </div>
        </div>
      </section>

      {/* Step 1: Create Project */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            1
          </div>
          <h2 className="text-2xl font-bold text-white">Create a New Project</h2>
        </div>
        
        <div className="pl-11 space-y-4">
          <p className="text-zinc-400">
            Create a new ASP.NET Core project and install the Kippo package:
          </p>
          <CodeBlock code={createProjectCode} language="bash" filename="Terminal" />
        </div>
      </section>

      {/* Step 2: Configure Token */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            2
          </div>
          <h2 className="text-2xl font-bold text-white">Configure Your Bot Token</h2>
        </div>
        
        <div className="pl-11 space-y-4">
          <p className="text-zinc-400">
            Add your bot token to <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">appsettings.json</code>:
          </p>
          <CodeBlock code={step1Code} language="json" filename="appsettings.json" />
          
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-blue-200 text-sm">
              <strong>Tip:</strong> For development, use <code className="px-1 py-0.5 rounded bg-zinc-800">appsettings.Development.json</code> to keep your token separate from production settings.
            </p>
          </div>
        </div>
      </section>

      {/* Step 3: Create Handler */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            3
          </div>
          <h2 className="text-2xl font-bold text-white">Create Your Bot Handler</h2>
        </div>
        
        <div className="pl-11 space-y-4">
          <p className="text-zinc-400">
            Create a new file <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">MyBotHandler.cs</code> with your bot logic:
          </p>
          <CodeBlock code={step2Code} language="csharp" filename="MyBotHandler.cs" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
              <h4 className="font-semibold text-white mb-2">[Command] Attribute</h4>
              <p className="text-zinc-400 text-sm">Handles commands like /start, /help</p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
              <h4 className="font-semibold text-white mb-2">[Text] Attribute</h4>
              <p className="text-zinc-400 text-sm">Handles text messages with pattern matching</p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Register Kippo */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            4
          </div>
          <h2 className="text-2xl font-bold text-white">Register Kippo in Program.cs</h2>
        </div>
        
        <div className="pl-11 space-y-4">
          <p className="text-zinc-400">
            Replace the contents of <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">Program.cs</code>:
          </p>
          <CodeBlock code={step3Code} language="csharp" filename="Program.cs" />
        </div>
      </section>

      {/* Step 5: Run */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            5
          </div>
          <h2 className="text-2xl font-bold text-white">Run Your Bot</h2>
        </div>
        
        <div className="pl-11 space-y-4">
          <p className="text-zinc-400">
            Start your bot with:
          </p>
          <CodeBlock code="dotnet run" language="bash" filename="Terminal" />
          
          <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <h3 className="text-xl font-semibold text-green-400 mb-2 flex items-center gap-2">
              <CheckCircle2 size={24} />
              Your bot is now live!
            </h3>
            <p className="text-zinc-300">
              Open Telegram and send <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">/start</code> to your bot to test it.
            </p>
          </div>
        </div>
      </section>

      {/* Project Structure */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Final Project Structure</h2>
        <CodeBlock 
          code={`MyTelegramBot/
├── Program.cs              # Application entry point
├── MyBotHandler.cs         # Your bot handlers
├── appsettings.json        # Configuration with bot token
└── MyTelegramBot.csproj    # Project file`}
          language="plaintext"
        />
      </section>

      {/* Next Steps */}
      <section className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <h2 className="text-2xl font-bold text-white mb-4">What's Next?</h2>
        <p className="text-zinc-300 mb-6">
          Now that your bot is running, explore more features:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/routing"
            className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
          >
            <span className="text-white font-medium">Learn about Routing</span>
            <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          </Link>
          <Link
            to="/keyboards"
            className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
          >
            <span className="text-white font-medium">Build Keyboards</span>
            <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          </Link>
          <Link
            to="/sessions"
            className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
          >
            <span className="text-white font-medium">Session Management</span>
            <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          </Link>
          <Link
            to="/examples"
            className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
          >
            <span className="text-white font-medium">View Examples</span>
            <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
