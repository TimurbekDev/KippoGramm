import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Info, AlertCircle } from 'lucide-react';

const basicConfig = `{
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

const developmentConfig = `{
  "Kippo": {
    "BotToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Kippo": "Debug"
    }
  }
}`;

const envVariables = `# Set environment variable
# Windows (PowerShell)
$env:Kippo__BotToken = "YOUR_BOT_TOKEN"

# Linux/macOS
export Kippo__BotToken="YOUR_BOT_TOKEN"

# Docker
docker run -e Kippo__BotToken="YOUR_BOT_TOKEN" mybot`;

const secretsManager = `# Initialize user secrets (development only)
dotnet user-secrets init

# Set the bot token
dotnet user-secrets set "Kippo:BotToken" "YOUR_BOT_TOKEN"

# List secrets
dotnet user-secrets list`;

const programCs = `using Kippo.Extensions;
using Kippo.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Configuration is automatically loaded from:
// 1. appsettings.json
// 2. appsettings.{Environment}.json
// 3. Environment variables
// 4. User secrets (Development only)

// Register Kippo - reads BotToken from configuration
builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<SessionMiddleware>();

var app = builder.Build();
app.Run();`;

const customConfig = `// appsettings.json
{
  "Kippo": {
    "BotToken": "YOUR_BOT_TOKEN"
  },
  "Bot": {
    "AdminUsers": [123456789, 987654321],
    "RateLimitSeconds": 2,
    "WelcomeMessage": "Welcome to my bot!"
  }
}

// Access in code
public class MyHandler : BotUpdateHandler
{
    private readonly IConfiguration _config;
    
    public MyHandler(IConfiguration config)
    {
        _config = config;
    }
    
    [Command("start")]
    public async Task Start(Context context)
    {
        var welcomeMessage = _config["Bot:WelcomeMessage"] ?? "Hello!";
        await context.Reply(welcomeMessage);
    }
}

// Or inject IConfiguration in method
[Command("admins")]
public async Task ShowAdmins(Context context, IConfiguration config)
{
    var admins = config.GetSection("Bot:AdminUsers").Get<long[]>();
    await context.Reply($"Admin count: {admins?.Length ?? 0}");
}`;

const optionsPattern = `// Create a settings class
public class BotSettings
{
    public const string SectionName = "Bot";
    
    public long[] AdminUsers { get; set; } = Array.Empty<long>();
    public int RateLimitSeconds { get; set; } = 2;
    public string WelcomeMessage { get; set; } = "Welcome!";
}

// Register in Program.cs
builder.Services.Configure<BotSettings>(
    builder.Configuration.GetSection(BotSettings.SectionName));

// Use in handler
public class MyHandler : BotUpdateHandler
{
    [Command("start")]
    public async Task Start(Context context, IOptions<BotSettings> options)
    {
        var settings = options.Value;
        await context.Reply(settings.WelcomeMessage);
    }
    
    [Command("admin")]
    public async Task AdminCommand(Context context, IOptions<BotSettings> options)
    {
        var userId = context.Update.Message?.From?.Id ?? 0;
        
        if (!options.Value.AdminUsers.Contains(userId))
        {
            await context.Reply("Access denied");
            return;
        }
        
        await context.Reply("Admin panel");
    }
}`;

const loggingConfig = `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Kippo": "Debug",
      "MyApp": "Debug"
    }
  }
}`;

const projectStructure = `MyTelegramBot/
├── Program.cs
├── MyHandler.cs
├── appsettings.json              # Base configuration
├── appsettings.Development.json  # Development overrides
├── appsettings.Production.json   # Production overrides
└── MyTelegramBot.csproj`;

export function Configuration() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Configuration</h1>
        <p className="text-xl text-zinc-400">
          Configure your Kippo bot using ASP.NET Core's configuration system. 
          Supports JSON files, environment variables, and user secrets.
        </p>
      </div>

      {/* Basic Configuration */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Basic Configuration</h2>
        <p className="text-zinc-400 mb-6">
          The minimum required configuration is your bot token in <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">appsettings.json</code>:
        </p>
        <CodeBlock code={basicConfig} language="json" filename="appsettings.json" />
      </section>

      {/* Environment-Specific */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Environment-Specific Configuration</h2>
        <p className="text-zinc-400 mb-6">
          Use environment-specific files for different settings:
        </p>
        <CodeBlock code={developmentConfig} language="json" filename="appsettings.Development.json" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">Project Structure</h4>
          <CodeBlock code={projectStructure} language="plaintext" />
        </div>
      </section>

      {/* Secure Token Storage */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Secure Token Storage</h2>
        
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 mb-6">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-red-200 text-sm">
            <strong>Security Warning:</strong> Never commit your bot token to version control! 
            Use environment variables or user secrets for sensitive data.
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-4">Environment Variables</h3>
        <p className="text-zinc-400 mb-4">
          Set the token via environment variable (recommended for production):
        </p>
        <CodeBlock code={envVariables} language="bash" filename="Environment Variables" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">User Secrets (Development)</h3>
        <p className="text-zinc-400 mb-4">
          Use .NET User Secrets for local development:
        </p>
        <CodeBlock code={secretsManager} language="bash" filename="User Secrets" />
      </section>

      {/* Program.cs */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Loading Configuration</h2>
        <p className="text-zinc-400 mb-6">
          Configuration is automatically loaded by ASP.NET Core:
        </p>
        <CodeBlock code={programCs} language="csharp" filename="Program.cs" />
        
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
          <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-blue-200 text-sm">
            <strong>Configuration Priority (highest to lowest):</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Command-line arguments</li>
              <li>Environment variables</li>
              <li>User secrets (Development only)</li>
              <li>appsettings.{'{Environment}'}.json</li>
              <li>appsettings.json</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Custom Configuration */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Custom Configuration</h2>
        <p className="text-zinc-400 mb-6">
          Add your own configuration sections for bot-specific settings:
        </p>
        <CodeBlock code={customConfig} language="csharp" filename="Custom Configuration" />
      </section>

      {/* Options Pattern */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Options Pattern</h2>
        <p className="text-zinc-400 mb-6">
          Use the Options pattern for strongly-typed configuration:
        </p>
        <CodeBlock code={optionsPattern} language="csharp" filename="Options Pattern" />
      </section>

      {/* Logging Configuration */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Logging Configuration</h2>
        <p className="text-zinc-400 mb-6">
          Configure logging levels for different namespaces:
        </p>
        <CodeBlock code={loggingConfig} language="json" filename="Logging Configuration" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">Log Levels</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 text-zinc-400">Level</th>
                <th className="text-left py-2 text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Trace</td>
                <td className="py-2 text-zinc-400">Most detailed logs</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Debug</td>
                <td className="py-2 text-zinc-400">Debugging information</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Information</td>
                <td className="py-2 text-zinc-400">General flow information</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Warning</td>
                <td className="py-2 text-zinc-400">Abnormal or unexpected events</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Error</td>
                <td className="py-2 text-zinc-400">Errors and exceptions</td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-mono">Critical</td>
                <td className="py-2 text-zinc-400">Failures requiring immediate attention</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex gap-4">
        <Link
          to="/dependency-injection"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Dependency Injection</p>
          </div>
        </Link>
        <Link
          to="/examples"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Examples</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
