import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';

const sessionBasics = `[Command("start")]
public async Task Start(Context context)
{
    // Set conversation state
    context.Session!.State = "awaiting_name";
    
    // Store data in session
    context.Session.Data["started_at"] = DateTime.Now;
    context.Session.Data["step"] = 1;
    
    await context.Reply("What's your name?");
}

[Text(State = "awaiting_name")]
public async Task HandleName(Context context)
{
    var name = context.Message.Text;
    
    // Save to session
    context.Session!.Data["name"] = name;
    context.Session.State = "awaiting_age";
    
    await context.Reply($"Nice to meet you, {name}! How old are you?");
}

[Text(State = "awaiting_age")]
public async Task HandleAge(Context context)
{
    if (int.TryParse(context.Message.Text, out var age))
    {
        context.Session!.Data["age"] = age;
        context.Session.State = null; // Clear state - registration complete
        
        var name = context.Session.Data["name"];
        await context.Reply($"Registration complete!\\nName: {name}, Age: {age}");
    }
    else
    {
        await context.Reply("Please enter a valid number");
    }
}`;

const sessionProperties = `// State - track conversation flow
context.Session!.State = "awaiting_input";
var currentState = context.Session.State; // Get current state

// Data - store any serializable data
context.Session.Data["key"] = value;
context.Session.Data["user_id"] = 12345;
context.Session.Data["preferences"] = new { theme = "dark", lang = "en" };

// Retrieve data
var name = context.Session.Data["name"];
var age = (int)context.Session.Data["age"];

// Check if key exists
if (context.Session.Data.ContainsKey("name"))
{
    // Key exists
}

// Get with default value
var country = context.Session.Data.GetValueOrDefault("country", "Unknown");

// Clear specific data
context.Session.Data.TryRemove("temp_data", out _);

// Clear all session data
context.Session.State = null;
context.Session.Data.Clear();`;

const enableSession = `// Program.cs
using Kippo.Extensions;
using Kippo.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<SessionMiddleware>(); // Enable sessions

var app = builder.Build();
app.Run();`;

const sessionInterface = `public interface ISessionStore
{
    Task<Session> GetAsync(long chatId);
    Task SaveAsync(long chatId, Session session);
    Task<bool> DeleteAsync(long chatId);
}`;

const sessionClass = `public class Session
{
    public long UserId { get; set; }
    public string? State { get; set; }
    public ConcurrentDictionary<string, object> Data { get; set; } = new();
}`;

const customSessionStorage = `using Kippo.SessionStorage;
using System.Text.Json;

public class FileSessionStorage : ISessionStore
{
    private readonly string _storagePath;

    public FileSessionStorage(string storagePath = "./sessions")
    {
        _storagePath = storagePath;
        Directory.CreateDirectory(_storagePath);
    }

    public async Task<Session> GetAsync(long chatId)
    {
        var filePath = Path.Combine(_storagePath, $"{chatId}.json");
        
        if (!File.Exists(filePath))
            return new Session { UserId = chatId };
        
        var json = await File.ReadAllTextAsync(filePath);
        return JsonSerializer.Deserialize<Session>(json) 
               ?? new Session { UserId = chatId };
    }

    public async Task SaveAsync(long chatId, Session session)
    {
        var filePath = Path.Combine(_storagePath, $"{chatId}.json");
        var json = JsonSerializer.Serialize(session, new JsonSerializerOptions 
        { 
            WriteIndented = true 
        });
        await File.WriteAllTextAsync(filePath, json);
    }

    public Task<bool> DeleteAsync(long chatId)
    {
        var filePath = Path.Combine(_storagePath, $"{chatId}.json");
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }
}

// Register in Program.cs (BEFORE AddKippo)
builder.Services.AddSingleton<ISessionStore, FileSessionStorage>();
builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<SessionMiddleware>();`;

const redisSessionStorage = `using Kippo.SessionStorage;
using StackExchange.Redis;
using System.Text.Json;

public class RedisSessionStorage : ISessionStore
{
    private readonly IDatabase _db;
    private readonly TimeSpan _expiry = TimeSpan.FromDays(7);

    public RedisSessionStorage(IConnectionMultiplexer redis)
    {
        _db = redis.GetDatabase();
    }

    public async Task<Session> GetAsync(long chatId)
    {
        var json = await _db.StringGetAsync($"session:{chatId}");
        
        if (json.IsNullOrEmpty)
            return new Session { UserId = chatId };
        
        return JsonSerializer.Deserialize<Session>(json!) 
               ?? new Session { UserId = chatId };
    }

    public async Task SaveAsync(long chatId, Session session)
    {
        var json = JsonSerializer.Serialize(session);
        await _db.StringSetAsync($"session:{chatId}", json, _expiry);
    }

    public async Task<bool> DeleteAsync(long chatId)
    {
        return await _db.KeyDeleteAsync($"session:{chatId}");
    }
}

// Register in Program.cs
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect("localhost:6379"));
builder.Services.AddSingleton<ISessionStore, RedisSessionStorage>();`;

const multiStepFlow = `[Command("register")]
public async Task StartRegistration(Context context)
{
    context.Session!.State = "reg_age";
    context.Session.Data["reg_started"] = DateTime.Now;
    
    var keyboard = ReplyKeyboardBuilder.Create()
        .Button("Cancel")
        .Resize()
        .Build();
    
    await context.Reply("Let's register! What's your age?", keyboard);
}

[Text(State = "reg_age")]
public async Task AskAge(Context context)
{
    if (context.Message.Text == "Cancel")
    {
        await CancelRegistration(context);
        return;
    }
    
    if (!int.TryParse(context.Message.Text, out var age) || age < 13 || age > 120)
    {
        await context.Reply("Please enter a valid age (13-120)");
        return;
    }
    
    context.Session!.Data["age"] = age;
    context.Session.State = "reg_name";
    
    await context.Reply("Great! What's your name?");
}

[Text(State = "reg_name")]
public async Task AskName(Context context)
{
    if (context.Message.Text == "Cancel")
    {
        await CancelRegistration(context);
        return;
    }
    
    var name = context.Message.Text;
    if (string.IsNullOrWhiteSpace(name) || name.Length < 2)
    {
        await context.Reply("Please enter a valid name (min 2 characters)");
        return;
    }
    
    context.Session!.Data["name"] = name;
    context.Session.State = "reg_country";
    
    var keyboard = InlineKeyboardBuilder.Create()
        .Button("USA", "country_usa")
        .Button("UK", "country_uk")
        .Row()
        .Button("Germany", "country_de")
        .Button("Other", "country_other")
        .Build();
    
    await context.Reply($"Nice to meet you, {name}! Where are you from?", keyboard);
}

[CallbackQuery("country_*")]
public async Task HandleCountry(Context context)
{
    var country = context.Callback.Data.Replace("country_", "").ToUpper();
    
    context.Session!.Data["country"] = country;
    context.Session.State = null; // Registration complete
    
    await context.Callback.Answer();
    
    var name = context.Session.Data["name"];
    var age = context.Session.Data["age"];
    
    await context.Reply(
        $"Registration Complete!\\n\\n" +
        $"Name: {name}\\n" +
        $"Age: {age}\\n" +
        $"Country: {country}",
        new ReplyKeyboardRemove()
    );
}

private async Task CancelRegistration(Context context)
{
    context.Session!.State = null;
    context.Session.Data.Clear();
    
    await context.Reply("Registration cancelled.", new ReplyKeyboardRemove());
}`;

export function Sessions() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Session Management</h1>
        <p className="text-xl text-zinc-400">
          Track user state and data across conversations with Kippo's built-in session management.
          Sessions are thread-safe and support custom storage backends.
        </p>
      </div>

      {/* Enable Sessions */}
      <section className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="text-blue-500" size={20} />
          Enabling Sessions
        </h2>
        <p className="text-zinc-400 mb-4">
          Sessions require the <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">SessionMiddleware</code> to be registered:
        </p>
        <CodeBlock code={enableSession} language="csharp" filename="Program.cs" />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Basic Usage</h2>
        <p className="text-zinc-400 mb-6">
          Use sessions to create multi-step conversation flows:
        </p>
        <CodeBlock code={sessionBasics} language="csharp" filename="Session Basics" />
      </section>

      {/* Session Properties */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Session Properties</h2>
        <p className="text-zinc-400 mb-6">
          The Session object provides State and Data properties:
        </p>
        <CodeBlock code={sessionProperties} language="csharp" filename="Session Properties" />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h4 className="font-semibold text-blue-400 mb-2">State</h4>
            <p className="text-zinc-400 text-sm">
              A string that tracks the current conversation state. Use with <code className="text-blue-400">[Text(State = "...")]</code> for state-specific handlers.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h4 className="font-semibold text-green-400 mb-2">Data</h4>
            <p className="text-zinc-400 text-sm">
              A thread-safe dictionary (<code className="text-green-400">ConcurrentDictionary</code>) for storing any data across messages.
            </p>
          </div>
        </div>
      </section>

      {/* Session Class */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Session Structure</h2>
        <CodeBlock code={sessionClass} language="csharp" filename="Session.cs" />
      </section>

      {/* Multi-Step Flow */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Complete Multi-Step Flow</h2>
        <p className="text-zinc-400 mb-6">
          Here's a complete example of a registration flow with validation and cancellation:
        </p>
        <CodeBlock code={multiStepFlow} language="csharp" filename="Registration Flow" />
      </section>

      {/* Custom Storage */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Custom Session Storage</h2>
        <p className="text-zinc-400 mb-6">
          By default, Kippo uses in-memory storage. For production, implement <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">ISessionStore</code>:
        </p>
        
        <CodeBlock code={sessionInterface} language="csharp" filename="ISessionStore Interface" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">File-Based Storage</h3>
        <CodeBlock code={customSessionStorage} language="csharp" filename="FileSessionStorage.cs" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Redis Storage</h3>
        <CodeBlock code={redisSessionStorage} language="csharp" filename="RedisSessionStorage.cs" />
      </section>

      {/* Best Practices */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Best Practices</h2>
        <ul className="space-y-3 text-zinc-400">
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Always clear the state when a flow is complete: <code className="text-blue-400">context.Session.State = null</code></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Provide a way to cancel multi-step flows</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Use meaningful state names like <code className="text-blue-400">"reg_age"</code>, <code className="text-blue-400">"order_confirm"</code></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>For production, use persistent storage (Redis, database, etc.)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-500 mt-1">!</span>
            <span>Session Data stores objects - cast when retrieving: <code className="text-blue-400">(int)context.Session.Data["age"]</code></span>
          </li>
        </ul>
      </section>

      {/* Navigation */}
      <section className="flex gap-4">
        <Link
          to="/keyboards"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Keyboards</p>
          </div>
        </Link>
        <Link
          to="/middleware"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Middleware</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
