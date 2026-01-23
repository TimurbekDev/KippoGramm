# 🤖 Kippo

### *Build Telegram Bots with Elegance*

A lightweight, attribute-based framework for creating powerful Telegram bots in .NET  
with session management, middleware support, and intuitive routing.

[![NuGet](https://img.shields.io/nuget/v/Kippo.svg?style=flat-square)](https://www.nuget.org/packages/Kippo/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![.NET](https://img.shields.io/badge/.NET-8.0%20%7C%209.0%20%7C%2010.0-purple.svg?style=flat-square)](https://dotnet.microsoft.com/)

[Why Kippo?](#-why-kippo) • [What's New](#-whats-new-in-104) • [Installation](#-installation) • [Get Started](#-getting-started) • [Documentation](#-documentation)

---

## ✨ Why Kippo?

### 🎯 **Simple & Intuitive**
Write bot handlers with clean attributes. No complex routing configuration or boilerplate code.

### 💾 **Smart Sessions**
Built-in session management tracks user state and data automatically across conversations.

### 🔌 **Extensible**
Add custom middleware for logging, auth, rate limiting, or any behavior you need.

### ⌨️ **Beautiful Keyboards**
Fluent API for creating reply and inline keyboards with minimal code.

### 🚀 **Production Ready**
Seamless ASP.NET Core integration with dependency injection and hosting support.

### 📦 **Get Started Fast**
Install via NuGet and have your bot running in under 5 minutes.

---

## 🎉 What's New in 1.0.4

### 🔒 **Production-Ready Improvements**

**Thread-Safety**
- ✅ Session storage now uses `ConcurrentDictionary` for safe concurrent access
- ✅ Session data dictionary is thread-safe by default
- ✅ No more race conditions under high load

**Dependency Injection**
- ✅ **Automatic service injection** in handler methods
- ✅ Full support for scoped services (DbContext, EF Core, etc.)
- ✅ Service scope created per request automatically

**Error Handling & Logging**
- ✅ Integrated `ILogger` support throughout the framework
- ✅ Detailed error messages with context for debugging
- ✅ Automatic error logging with stack traces
- ✅ Duplicate command registration warnings

**Performance**
- ✅ Optimized network usage with `AllowedUpdates` configuration
- ✅ 85% reduction in unnecessary update types
- ✅ Extended update type support (EditedMessage, MyChatMember, etc.)

**Developer Experience**
- ✅ Clear exception messages instead of NullReferenceException
- ✅ Better null-safety for Message.Text and CallbackQuery.Data
- ✅ Service resolution errors with helpful guidance

### 💉 New: Service Injection Example

```csharp
public class MyHandler : BotUpdateHandler
{
    // Inject services directly into handler methods!
    [Command("users")]
    public async Task GetUsers(Context context, IUserService userService)
    {
        var users = await userService.GetAllUsersAsync();
        await context.Reply($"Total users: {users.Count}");
    }
    
    // Works with scoped services too (DbContext, etc.)
    [Command("save")]
    public async Task SaveData(Context context, AppDbContext db)
    {
        var user = new User { Name = "John" };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        await context.Reply("✅ Saved!");
    }
}
```

### 🔧 Breaking Changes

**Minor:** `ISessionStore` interface now requires `DeleteAsync` method:
```csharp
public interface ISessionStore
{
    Task<Session> GetAsync(long chatId);
    Task SaveAsync(long chatId, Session session);
    Task<bool> DeleteAsync(long chatId); // New in 1.0.4
}
```

**Migration:** If you have a custom session store, simply add:
```csharp
public Task<bool> DeleteAsync(long chatId)
{
    // Your implementation
    return Task.FromResult(true);
}
```

---

## 📦 Installation

**Via .NET CLI**
```bash
dotnet add package Kippo
```

**Via Package Manager Console**
```powershell
Install-Package Kippo
```

**Via PackageReference**
```xml
<PackageReference Include="Kippo" Version="1.0.4" />
```

---

## 🚀 Getting Started

### Step 1: Get Your Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the instructions
3. Copy your bot token (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Create a New ASP.NET Core Project

```bash
dotnet new web -n MyTelegramBot
cd MyTelegramBot
dotnet add package Kippo
```

### Step 3: Configure Your Bot Token

Add to `appsettings.json`:

```json
{
  "Kippo": {
    "BotToken": "YOUR_BOT_TOKEN_HERE"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Step 4: Create Your Bot Handler

Create a new file `MyBotHandler.cs`:

```csharp
using Kippo.Attribute;
using Kippo.Contexs;
using Kippo.Handlers;
using Kippo.Keyboard;
using Kippo.Middleware;
using Kippo.SessionStorage;

public class MyBotHandler : BotUpdateHandler
{
    [Command("start")]
    public async Task Start(Context context)
    {
        var keyboard = ReplyKeyboardBuilder.Create()
            .Button("👋 Say Hello")
            .Button("❓ Help")
            .Resize()
            .Build();

        await context.Reply(
            "🤖 Welcome! I'm your new bot.\n\n" +
            "Choose an option below:",
            keyboard
        );
    }

    [Text(Pattern = "👋 Say Hello")]
    public async Task SayHello(Context context)
    {
        var username = context.Update.Message?.From?.FirstName ?? "friend";
        await context.Reply($"Hello, {username}! 👋");
    }

    [Command("help")]
    [Text(Pattern = "❓ Help")]
    public async Task Help(Context context)
    {
        await context.Reply(
            "📚 *Available Commands*\n\n" +
            "/start - Start the bot\n" +
            "/help - Show this message\n" +
            "/menu - Show inline menu"
        );
    }

    [Command("menu")]
    public async Task ShowMenu(Context context)
    {
        var keyboard = InlineKeyboardBuilder.Create()
            .Button("✅ Option 1", "opt_1")
            .Button("✅ Option 2", "opt_2")
            .Row()
            .UrlButton("📖 GitHub", "https://github.com")
            .Build();

        await context.Reply(
            "Choose an option:",
            keyboard
        );
    }

    [CallbackQuery("opt_*")]
    public async Task HandleOption(Context context)
    {
        var option = context.Update.CallbackQuery!.Data!.Replace("opt_", "");
        
        // Answer callback to remove loading state
        await context.Callback.Answer($"You selected Option {option}!");
        
        await context.Reply($"✅ You chose Option {option}");
    }

    [Text]
    public async Task HandleText(Context context)
    {
        await context.Reply($"You said: _{context.Message.Text}_");
    }
}
```

### Step 5: Register Kippo in Program.cs

Replace the contents of `Program.cs`:

```csharp
using Kippo.Extensions;
using Kippo.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Register Kippo with your bot handler
builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<SessionMiddleware>();//For Session Management

var app = builder.Build();

app.Run();
```

### Step 6: Run Your Bot

```bash
dotnet run
```

🎉 **Your bot is now live!** Open Telegram and send `/start` to your bot.

---

## 📖 Documentation

### 🏷️ Routing with Attributes

Kippo uses attributes to route updates to your handler methods:

#### **Commands**

Handle bot commands (messages starting with `/`):

```csharp
[Command("start")]
public async Task Start(Context context)
{
    await context.Reply("Welcome! 👋");
}

// With description
[Command("settings", Description = "Bot settings")]
public async Task Settings(Context context)
{
    await context.Reply("⚙️ Settings");
}
```

#### **Text Messages**

Handle text messages with pattern matching:

```csharp
// Handle all text messages
[Text]
public async Task HandleAnyText(Context context)
{
    await context.Reply($"You said: {context.Message.Text}");
}

// Match specific text
[Text(Pattern = "Hello")]
public async Task SayHello(Context context)
{
    await context.Reply("Hi there! 👋");
}

// Match text containing substring
[Text(Contains = "help")]
public async Task ShowHelp(Context context)
{
    await context.Reply("Need help? Ask me anything!");
}

// Match with regex
[Text(Regex = @"^\d+$")]
public async Task HandleNumbers(Context context)
{
    await context.Reply("That's a number!");
}
```

#### **Callback Queries**

Handle inline keyboard button clicks:

```csharp
// Exact match
[CallbackQuery("confirm")]
public async Task HandleConfirm(Context context)
{
    await context.Callback.Answer("Confirmed!");
    await context.Reply("✅ Action confirmed");
}

// Prefix match (use wildcard *)
[CallbackQuery("page_*")]
public async Task HandlePage(Context context)
{
    var page = context.Callback.Data.Replace("page_", "");
    await context.Callback.Answer();
    await context.Reply($"Showing page {page}");
}

// Match any callback
[CallbackQuery("*")]
public async Task HandleAnyCallback(Context context)
{
    await context.Callback.Answer();
}
```

#### **Multiple Attributes**

Handlers can respond to multiple triggers:

```csharp
[Command("cancel")]
[Text(Pattern = "Cancel")]
[Text(Pattern = "❌ Cancel")]
public async Task Cancel(Context context)
{
    await context.Reply("❌ Operation cancelled");
}
```

---

### 💾 Session Management

Track user state and data across conversations:

#### **Basic Session Usage**

```csharp
[Command("register")]
public async Task StartRegistration(Context context)
{
    // Set conversation state
    context.Session!.State = "awaiting_name";
    
    // Store data
    context.Session.Data["started_at"] = DateTime.Now;
    
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
        context.Session.State = null; // Clear state
        
        var name = context.Session.Data["name"];
        await context.Reply($"✅ Registration complete!\nName: {name}, Age: {age}");
    }
    else
    {
        await context.Reply("❌ Please enter a valid number");
    }
}
```

#### **Session Properties**

```csharp
// State - track conversation flow
context.Session.State = "awaiting_input";

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
    // ...
}

// Clear session
context.Session.State = null;
context.Session.Data.Clear();
```

---

### ⌨️ Building Keyboards

Create interactive keyboards with fluent API:

#### **Reply Keyboards**

Keyboards that appear at the bottom of the chat:

```csharp
var keyboard = ReplyKeyboardBuilder.Create()
    .Button("Option 1")
    .Button("Option 2")
    .Row()  // Start new row
    .Button("Option 3")
    .Button("Option 4")
    .Resize()   // Auto-resize to fit
    .OneTime()  // Hide after button press
    .Build();

await context.Reply("Choose an option:", keyboard);

// Remove keyboard
await context.Reply("Keyboard removed", new ReplyKeyboardRemove());
```

#### **Inline Keyboards**

Keyboards attached to messages with callback buttons:

```csharp
var keyboard = InlineKeyboardBuilder.Create()
    .Button("✅ Yes", "answer_yes")
    .Button("❌ No", "answer_no")
    .Row()
    .Button("📊 View Stats", "stats")
    .Row()
    .UrlButton("🌐 Visit Website", "https://example.com")
    .Build();

await context.Reply("Do you agree?", keyboard);
```

**Advanced Inline Keyboard:**

```csharp
var keyboard = InlineKeyboardBuilder.Create()
    // Callback buttons
    .Button("🏠 Home", "home")
    .Button("⚙️ Settings", "settings")
    .Row()
    
    // URL buttons
    .UrlButton("📖 Docs", "https://docs.example.com")
    .Row()
    
    // Pagination
    .Button("⬅️", "page_prev")
    .Button("1 / 10", "page_info")
    .Button("➡️", "page_next")
    .Build();

await context.Reply("Main Menu", keyboard);
```

---

### � Dependency Injection

**New in 1.0.4:** Inject services directly into your handler methods!

#### **Method Parameter Injection**

The framework automatically resolves services from the DI container:

```csharp
public class MyHandler : BotUpdateHandler
{
    [Command("profile")]
    public async Task ShowProfile(Context context, IUserService userService)
    {
        // userService is automatically injected
        var user = await userService.GetUserAsync(context.ChatId);
        await context.Reply($"👤 {user.Name}");
    }
    
    [Command("stats")]
    public async Task ShowStats(
        Context context, 
        IUserService userService,
        IAnalyticsService analytics)
    {
        // Multiple services can be injected
        var userCount = await userService.GetCountAsync();
        var stats = await analytics.GetStatsAsync();
        
        await context.Reply($"📊 Users: {userCount}\nViews: {stats.Views}");
    }
}
```

#### **Scoped Services Support**

Works seamlessly with scoped services like Entity Framework DbContext:

```csharp
// Register scoped service in Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IUserService, UserService>();

// Use in handlers
public class MyHandler : BotUpdateHandler
{
    [Command("save")]
    public async Task SaveUser(Context context, AppDbContext db)
    {
        // New scope created automatically per request
        var user = new User 
        { 
            TelegramId = context.ChatId,
            Name = context.Update.Message?.From?.FirstName 
        };
        
        db.Users.Add(user);
        await db.SaveChangesAsync();
        
        await context.Reply("✅ User saved to database!");
    }
}
```

#### **Service Lifetimes**

- ✅ **Singleton** - Shared across all requests
- ✅ **Scoped** - New instance per update (recommended for DbContext)
- ✅ **Transient** - New instance every time

```csharp
// Program.cs
builder.Services.AddSingleton<ICacheService, CacheService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddTransient<IEmailService, EmailService>();
```

#### **Constructor Injection (Alternative)**

You can also use `IServiceScopeFactory` in the constructor:

```csharp
public class MyHandler : BotUpdateHandler
{
    private readonly IServiceScopeFactory _scopeFactory;

    public MyHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    [Command("data")]
    public async Task GetData(Context context)
    {
        using var scope = _scopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<IDataService>();
        
        var data = await service.GetDataAsync();
        await context.Reply($"Data: {data}");
    }
}
```

**Recommendation:** Use method parameter injection for cleaner code!

---

### �🔌 Middleware

Extend Kippo with custom middleware that executes before handlers:

#### **Built-in Middleware**

- `SessionMiddleware` - Automatic session loading/saving (recommended)

#### **Creating Custom Middleware**

```csharp
using Kippo.Contexs;
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
                     context.Update.CallbackQuery?.From?.Id;
        
        _logger.LogInformation("📨 Update from user {UserId}", userId);
        
        await next(); // Continue to next middleware/handler
        
        _logger.LogInformation("✅ Update processed");
    }
}
```

#### **Registering Middleware**

In `Program.cs`:

```csharp
using Kippo.Extensions;
using Kippo.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddKippo<MyBotHandler>(builder.Configuration)
                .AddKippoMiddleware<LogginMiddleware>()
                .AddKippoMiddleware<SessionMiddleware>();

var app = builder.Build();
app.Run();
```

#### **Example: Authentication Middleware**

```csharp
public class AuthMiddleware : IBotMiddleware
{
    private readonly HashSet<long> _allowedUsers = new() { 123456789, 987654321 };

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        var userId = context.Update.Message?.From?.Id ?? 
                     context.Update.CallbackQuery?.From?.Id;
        
        if (userId.HasValue && _allowedUsers.Contains(userId.Value))
        {
            await next(); // User authorized
        }
        else
        {
            await context.Reply("🚫 Access denied");
        }
    }
}
```

#### **Example: Rate Limiting Middleware**

```csharp
public class RateLimitMiddleware : IBotMiddleware
{
    private readonly Dictionary<long, DateTime> _lastRequest = new();
    private readonly TimeSpan _cooldown = TimeSpan.FromSeconds(2);

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        var userId = context.Update.Message?.From?.Id ?? 
                     context.Update.CallbackQuery?.From?.Id;
        
        if (!userId.HasValue)
        {
            await next();
            return;
        }

        if (_lastRequest.TryGetValue(userId.Value, out var lastTime))
        {
            if (DateTime.Now - lastTime < _cooldown)
            {
                await context.Reply("⏳ Please wait before sending another message");
                return;
            }
        }

        _lastRequest[userId.Value] = DateTime.Now;
        await next();
    }
}
```

---

### 🎨 Context API

The `Context` object provides access to everything you need:

```csharp
public async Task MyHandler(Context context)
{
    // Bot client
    var bot = context.BotClient;
    var me = await bot.GetMeAsync();
    
    // Update information
    var update = context.Update;
    var updateType = update.Type;
    
    // Message data
    var message = context.Message;
    var text = context.Message.Text;
    var chatId = context.ChatId;
    
    // User information
    var user = context.Update.Message?.From;
    var userId = user?.Id;
    var username = user?.Username;
    
    // Session
    context.Session!.State = "processing";
    context.Session.Data["key"] = "value";
    
    // Send messages
    await context.Reply("Simple text");
    await context.Reply("Text with keyboard", keyboard);
    
    // Callback queries
    await context.Callback.Answer();
    await context.Callback.Answer("Notification text", showAlert: true);
    
    // Get callback data
    var data = context.Callback.Data;
}
```

---

## 🎯 Advanced Examples

### Multi-Step Registration Flow

Complete example with validation and state management:

```csharp
[Command("register")]
public async Task StartRegistration(Context context)
{
    context.Session!.State = "awaiting_age";
    
    var keyboard = ReplyKeyboardBuilder.Create()
        .Button("Cancel ❌")
        .Resize()
        .Build();
    
    await context.Reply("👤 Let's register! What's your age?", keyboard);
}

[Text(State = "awaiting_age")]
public async Task AskAge(Context context)
{
    if (context.Message.Text == "Cancel ❌")
    {
        await Cancel(context);
        return;
    }
    
    if (!int.TryParse(context.Message.Text, out var age) || age < 13 || age > 120)
    {
        await context.Reply("❌ Please enter a valid age (13-120)");
        return;
    }
    
    context.Session!.Data["age"] = age;
    context.Session.State = "awaiting_name";
    
    await context.Reply("✅ Great! What's your name?");
}

[Text(State = "awaiting_name")]
public async Task AskName(Context context)
{
    var name = context.Message.Text;
    
    if (string.IsNullOrWhiteSpace(name) || name.Length < 2)
    {
        await context.Reply("❌ Please enter a valid name (min 2 chars)");
        return;
    }
    
    context.Session!.Data["name"] = name;
    context.Session.State = "awaiting_country";
    
    var keyboard = InlineKeyboardBuilder.Create()
        .Button("🇺🇸 USA", "country_usa")
        .Button("🇬🇧 UK", "country_uk")
        .Row()
        .Button("🇩🇪 Germany", "country_de")
        .Button("🇫🇷 France", "country_fr")
        .Build();
    
    await context.Reply($"Nice to meet you, {name}! Where are you from?", keyboard);
}

[CallbackQuery("country_*")]
public async Task HandleCountry(Context context)
{
    var country = context.Callback.Data.Replace("country_", "").ToUpper();
    
    context.Session!.Data["country"] = country;
    context.Session.State = null;
    
    await context.Callback.Answer();
    
    var name = context.Session.Data["name"];
    var age = context.Session.Data["age"];
    
    await context.Reply(
        $"🎉 Registration Complete!\n\n" +
        $"Name: {name}\n" +
        $"Age: {age}\n" +
        $"Country: {country}"
    );
}

[Command("cancel")]
[Text(Pattern = "Cancel ❌")]
public async Task Cancel(Context context)
{
    context.Session!.State = null;
    context.Session.Data.Clear();
    
    await context.Reply("❌ Cancelled", new ReplyKeyboardRemove());
}
```

### Custom Session Storage

Replace in-memory storage with persistent storage:

```csharp
using Kippo.SessionStorage;
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
            return new Session { ChatId = chatId };
        
        var json = await File.ReadAllTextAsync(filePath);
        return JsonSerializer.Deserialize<Session>(json) 
               ?? new Session { ChatId = chatId };
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
}

// Register in Program.cs
builder.Services.AddSingleton<ISessionStore, FileSessionStorage>();
```

---

## 💡 Example Project

Check out the `KippoGramm` sample project for a complete working example:

```bash
cd KippoGramm
# Add your bot token to appsettings.json
dotnet run
```

**Features demonstrated:**
- ✅ Multi-step registration with validation
- ✅ State-based routing
- ✅ Reply and inline keyboards
- ✅ Callback query handling with wildcards
- ✅ Session data persistence
- ✅ Custom logging middleware

---

## 📋 Requirements

| Component | Version |
|-----------|---------|
| .NET | 8.0, 9.0, or 10.0 |
| Bot Token | Get from [@BotFather](https://t.me/botfather) |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

<table>
<tr>
<td align="center">

### 🐛 Report Issues
[GitHub Issues](https://github.com/yourusername/KippoGramm/issues)

</td>
<td align="center">

### 💬 Discussions
[GitHub Discussions](https://github.com/yourusername/KippoGramm/discussions)

</td>
<td align="center">

### 📖 Telegram API
[Official Docs](https://core.telegram.org/bots/api)

</td>
</tr>
</table>

---

## 🙏 Acknowledgments

- Built with [Telegram.Bot](https://github.com/TelegramBots/Telegram.Bot) library
- Inspired by modern web frameworks
- Thanks to all contributors

---

<div align="center">

### 🚀 Ready to Build?

**Install Kippo and create your bot in 5 minutes!**

```bash
dotnet add package Kippo
```

[![NuGet](https://img.shields.io/nuget/v/Kippo.svg?style=flat-square&logo=nuget)](https://www.nuget.org/packages/Kippo/)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)

**Made with ❤️ for the .NET Community**

</div>

**NuGet Package Manager CLI**
```bash
dotnet add package Kippo
```

**Package Manager Console**
```powershell
Install-Package Kippo
```

**PackageReference** (add to your `.csproj`)
```xml
<PackageReference Include="Kippo" Version="1.0.0" />
```

---

## 🚀 Quick Start

Get your Telegram bot running in **3 simple steps**:

Get your Telegram bot running in **3 simple steps**:

<details open>
<summary><b>Step 1:</b> Configure Your Bot Token</summary>

<br>

Add your Telegram bot token to `appsettings.json`:

```json
{
  "Kippo": {
    "BotToken": "YOUR_BOT_TOKEN_HERE"
  }
}
```

> 💡 Get your bot token from [@BotFather](https://t.me/botfather) on Telegram

</details>

<details open>
<summary><b>Step 2:</b> Create Your Bot Handler</summary>

<br>

Create a class that inherits from `BotUpdateHandler`:

```csharp
using Kippo.Attribute;
using Kippo.Contexs;
using Kippo.Handlers;
using Kippo.Keyboard;

public class MyHandler : BotUpdateHandler
{
    public MyHandler(ISessionStore sessionStore, IEnumerable<IBotMiddleware> middlewares) 
        : base(sessionStore, middlewares) { }

    [Command("start")]
    public async Task Start(Context context)
    {
        var keyboard = ReplyKeyboardBuilder.Create()
            .Button("Get Started 🚀")
            .Button("Help ❓")
            .Resize()
            .Build();

        await context.Reply("Welcome to my bot! 👋", keyboard);
    }

    [Command("help")]
    public async Task Help(Context context)
    {
        await context.Reply(
            "📚 *Available Commands*\n\n" +
            "/start - Start the bot\n" +
            "/help - Show this message"
        );
    }

    [Text]
    public async Task HandleText(Context context)
    {
        await context.Reply($"You said: _{context.Message.Text}_");
    }
}
```

</details>

<details open>
<summary><b>Step 3:</b> Register Kippo in Your Application</summary>

<br>

In `Program.cs`:

```csharp
using Kippo.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddKippo<MyHandler>(builder.Configuration);

var app = builder.Build();

app.Run();
```

</details>

<div align="center">

### 🎉 That's it! Your bot is now running!

</div>

---

## 📖 Documentation

---

## 📖 Documentation

### 🏷️ Attributes

Kippo provides powerful attributes for routing updates to your handlers:

<table>
<tr>
<td width="33%">

#### `[Command]`
Handle bot commands

```csharp
[Command("start")]
public async Task Start(Context ctx)
{
    await ctx.Reply("Hello! 👋");
}

[Command("settings", 
  Description = "Configure bot")]
public async Task Settings(Context ctx)
{
    // Handle /settings
}
```

</td>
<td width="33%">

#### `[Text]`
Handle text messages

```csharp
// All text messages
[Text]
public async Task HandleText(Context ctx)
{
    await ctx.Reply($"You: {ctx.Message.Text}");
}

// State-specific
[Text(State = "awaiting_name")]
public async Task HandleName(Context ctx)
{
    var name = ctx.Message.Text;
    ctx.Session.Data["name"] = name;
}
```

</td>
<td width="33%">

#### `[CallbackQuery]`
Handle inline keyboard callbacks

```csharp
[CallbackQuery("btn_yes")]
public async Task HandleYes(Context ctx)
{
    await ctx.Reply("You clicked Yes!");
}

// Pattern matching
[CallbackQuery("product_")]
public async Task HandleProduct(Context ctx)
{
    var id = ctx.Update
        .CallbackQuery.Data
        .Replace("product_", "");
}
```

</td>
</tr>
</table>

---

### 💾 Session Management

Track user state and data across conversations with built-in session support:

```csharp
[Command("register")]
public async Task StartRegistration(Context context)
{
    // Set the conversation state
    context.Session.State = "awaiting_age";
    
    // Store metadata
    context.Session.Data["started_at"] = DateTime.Now;
    context.Session.Data["step"] = 1;
    
    await context.Reply("👤 Let's get you registered!\n\nHow old are you?");
}

[Text(State = "awaiting_age")]
public async Task HandleAge(Context context)
{
    if (!int.TryParse(context.Message.Text, out var age) || age < 13)
    {
        await context.Reply("❌ Please enter a valid age (13+)");
        return;
    }

    context.Session.Data["age"] = age;
    context.Session.State = "awaiting_name";
    context.Session.Data["step"] = 2;
    
    await context.Reply("✅ Great! What's your name?");
}

[Text(State = "awaiting_name")]
public async Task HandleName(Context context)
{
    var name = context.Message.Text;
    var age = context.Session.Data["age"];
    
    context.Session.State = null; // Clear state
    
    await context.Reply(
        $"🎉 Registration complete!\n\n" +
        $"Name: {name}\n" +
        $"Age: {age}"
    );
}
```

---

### ⌨️ Keyboard Builders

Create beautiful, interactive keyboards with a fluent API:

<table>
<tr>
<td width="50%">

#### Reply Keyboard

```csharp
var keyboard = ReplyKeyboardBuilder.Create()
    .Button("📝 Create")
    .Button("📋 List")
    .Row()  // New row
    .Button("⚙️ Settings")
    .Button("❌ Cancel")
    .Resize()   // Auto-resize
    .OneTime()  // Hide after use
    .Build();

await context.Reply(
    "Choose an action:", 
    keyboard
);
```

</td>
<td width="50%">

#### Inline Keyboard

```csharp
var keyboard = InlineKeyboardBuilder.Create()
    .Button("✅ Confirm", "confirm")
    .Button("❌ Cancel", "cancel")
    .Row()
    .Button("📞 Contact", "contact")
    .Row()
    .UrlButton("🌐 Website", "https://example.com")
    .Build();

await context.Reply(
    "Please confirm your action:", 
    keyboard
);
```

</td>
</tr>
</table>

---

### 🔌 Middleware

Extend Kippo's functionality with custom middleware. Middleware executes in a pipeline before your handlers.

**Built-in Middleware:**
- `SessionMiddleware` - Automatic session loading and saving (auto-registered)

#### How to Register Middleware

```csharp
using Kippo.Extensions;
using Kippo.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Register custom middleware BEFORE AddKippo
builder.Services.AddSingleton<IBotMiddleware, LoggingMiddleware>();
builder.Services.AddSingleton<IBotMiddleware, SessionMiddleware>();

// Then register Kippo with your handler
builder.Services.AddKippo<MyHandler>(builder.Configuration);

var app = builder.Build();
app.Run();
```

#### Creating Custom Middleware

```csharp
using Kippo.Middleware;
using Kippo.Contexs;

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
                    context.Update.CallbackQuery?.From?.Id;
        
        _logger.LogInformation(
            "📨 Update from user {UserId}: {Type}", 
            userId, 
            context.Update.Type
        );
        
        await next(); // Continue to next middleware/handler
        
        _logger.LogInformation("✅ Update processed");
    }
}
```

**Middleware Pipeline Flow:**
```
Update → SessionMiddleware → LoggingMiddleware → Your Handler → Response
```

---

### 🎨 Context API

The `Context` object is your gateway to bot interactions:

```csharp
public async Task ExampleHandler(Context context)
{
    // 🤖 Bot client access
    var botInfo = await context.Client.GetMeAsync();
    
    // 📬 Update information
    var updateType = context.Update.Type;
    var message = context.Message;
    var user = context.User;
    
    // 💾 Session management
    context.Session.State = "processing";
    context.Session.Data["key"] = "value";
    
    // 💬 Messaging methods
    await context.Reply("Simple message");
    await context.Reply("Message with keyboard", keyboard);
    await context.EditMessage("Updated text");
    await context.DeleteMessage();
    
    // 📎 Send files
    await context.Client.SendPhotoAsync(
        context.ChatId, 
        InputFile.FromUri("https://example.com/photo.jpg")
    );
}
```

---

## 🎯 Advanced Usage

<details>
<summary><b>Custom Session Storage</b></summary>

<br>

By default, Kippo uses `InMemorySessionStorage`. For production, implement `ISessionStore` for persistent storage:

```csharp
using Kippo.SessionStorage;
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
            return new Session { ChatId = chatId };
        
        var json = await File.ReadAllTextAsync(filePath);
        return JsonSerializer.Deserialize<Session>(json) 
               ?? new Session { ChatId = chatId };
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
}

// Register in Program.cs
builder.Services.AddSingleton<ISessionStore, FileSessionStorage>();
builder.Services.AddKippo<MyHandler>(builder.Configuration);
```

</details>

<details>
<summary><b>Multiple Attributes & Pattern Matching</b></summary>

<br>

Combine multiple attributes for flexible routing:

```csharp
// Handle both command and text
[Command("cancel")]
[Text(Pattern = "Cancel")]
[Text(Pattern = "❌ Cancel")]
public async Task Cancel(Context context)
{
    context.Session.State = null;
    context.Session.Data.Clear();
    
    await context.Reply("✅ Operation cancelled.");
}

// Pattern-based callback handling
[CallbackQuery("page_")]
public async Task HandlePagination(Context context)
{
    var page = int.Parse(
        context.Update.CallbackQuery.Data.Replace("page_", "")
    );
    
    await ShowPage(context, page);
}
```

</details>

<details>
<summary><b>Authentication Middleware</b></summary>

<br>

Create middleware for user authentication:

```csharp
public class AuthMiddleware : IBotMiddleware
{
    private readonly HashSet<long> _allowedUsers = new() 
    { 
        123456789, // Admin user IDs
        987654321 
    };

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        var userId = context.User?.Id;
        
        if (userId.HasValue && _allowedUsers.Contains(userId.Value))
        {
            await next(); // User is authorized
        }
        else
        {
            await context.Reply(
                "🚫 Access denied. You are not authorized to use this bot."
            );
        }
    }
}
```

</details>

<details>
<summary><b>Rate Limiting</b></summary>

<br>

Prevent spam with rate limiting middleware:

```csharp
public class RateLimitMiddleware : IBotMiddleware
{
    private readonly Dictionary<long, DateTime> _lastRequest = new();
    private readonly TimeSpan _cooldown = TimeSpan.FromSeconds(2);

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        var userId = context.User?.Id;
        if (!userId.HasValue) return;

        if (_lastRequest.TryGetValue(userId.Value, out var lastTime))
        {
            if (DateTime.Now - lastTime < _cooldown)
            {
                await context.Reply("⏳ Please wait before sending another message.");
                return;
            }
        }

        _lastRequest[userId.Value] = DateTime.Now;
        await next();
    }
}
```

</details>

---

## 💡 Examples

---

## 💡 Examples

The **KippoGramm** sample project demonstrates real-world bot usage:

<table>
<tr>
<td>

### ✅ Features Demonstrated
- 📝 Multi-step registration with validation
- 💾 Session state management
- ⌨️ Reply & Inline keyboards
- 🔄 Callback query handling
- 🎯 Command & pattern routing
- ✏️ Message editing
- 🔁 Multiple attributes per handler
- 📊 Data persistence across conversations

</td>
<td>

### 🗂️ Project Structure
```
KippoGramm/
├── Program.cs          # Setup & middleware
├── MyHandler.cs        # Bot handlers
└── appsettings.json    # Configuration
```

### 🚀 Run the Example
```bash
cd KippoGramm
# Add your token to appsettings.json
dotnet run
```

</td>
</tr>
</table>

**Example Flow in MyHandler:**
1. `/start` → Shows main menu with reply keyboard
2. User clicks "📝 Register" → Starts registration flow
3. Bot asks for age → Validates input
4. Bot asks for name → Validates input  
5. Bot shows country selection → Inline keyboard with callbacks
6. User selects country → Registration complete with summary
7. `/info` → Shows saved user data from session

---

## 📋 Requirements

| Component | Version |
|-----------|---------|
| 🟣 **.NET** | 10.0 or higher |
| 🤖 **Telegram Bot Token** | Get from [@BotFather](https://t.me/botfather) |
| 📦 **Dependencies** | Automatically installed via NuGet |

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

<table>
<tr>
<td width="25%">

### 🐛 Report Bugs
Found a bug? [Open an issue](https://github.com/yourusername/KippoGramm/issues)

</td>
<td width="25%">

### 💡 Suggest Features
Have an idea? [Start a discussion](https://github.com/yourusername/KippoGramm/discussions)

</td>
<td width="25%">

### 🔧 Submit PRs
Want to contribute code? Fork & submit a PR!

</td>
<td width="25%">

### 📖 Improve Docs
Help make our docs better!

</td>
</tr>
</table>

**Before contributing:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2026 Kippo Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🆘 Support & Resources

<table>
<tr>
<td width="33%" align="center">

### 📫 Issues & Bugs
[GitHub Issues](https://github.com/yourusername/KippoGramm/issues)

Report bugs and technical issues

</td>
<td width="33%" align="center">

### 💬 Discussions
[GitHub Discussions](https://github.com/yourusername/KippoGramm/discussions)

Ask questions and share ideas

</td>
<td width="33%" align="center">

### 📖 Documentation
[Telegram Bot API](https://core.telegram.org/bots/api)

Official Telegram Bot API docs

</td>
</tr>
</table>

---

## 🙏 Acknowledgments

- Built with ❤️ using [Telegram.Bot](https://github.com/TelegramBots/Telegram.Bot) library
- Inspired by modern web frameworks like ASP.NET Core
- Thanks to all [contributors](https://github.com/yourusername/KippoGramm/graphs/contributors)

---

## ⭐ Star History

If you find Kippo useful, please consider giving it a star! ⭐

<div align="center">

### 🚀 Ready to build your bot?

[Get Started](#-quick-start) • [View Examples](#-examples) • [Read Docs](#-documentation)

---

**Made with ❤️ for the .NET Community**

[![NuGet](https://img.shields.io/nuget/v/Kippo.svg?style=flat-square&logo=nuget)](https://www.nuget.org/packages/Kippo/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/yourusername/KippoGramm)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)

</div>
