import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Info, Zap } from 'lucide-react';

const methodInjection = `public class MyHandler : BotUpdateHandler
{
    [Command("profile")]
    public async Task ShowProfile(Context context, IUserService userService)
    {
        // userService is automatically injected from DI container
        var user = await userService.GetUserAsync(context.ChatId);
        await context.Reply($"Name: {user.Name}");
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
        
        await context.Reply($"Users: {userCount}\\nViews: {stats.Views}");
    }
}`;

const scopedServices = `// Program.cs - Register scoped services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IUserService, UserService>();

// Handler - Use scoped services
public class MyHandler : BotUpdateHandler
{
    [Command("save")]
    public async Task SaveUser(Context context, AppDbContext db)
    {
        // New DbContext scope created automatically per request
        var user = new User 
        { 
            TelegramId = context.ChatId,
            Name = context.Update.Message?.From?.FirstName 
        };
        
        db.Users.Add(user);
        await db.SaveChangesAsync();
        
        await context.Reply("User saved to database!");
    }
    
    [Command("users")]
    public async Task ListUsers(Context context, AppDbContext db)
    {
        var users = await db.Users.Take(10).ToListAsync();
        var list = string.Join("\\n", users.Select(u => u.Name));
        await context.Reply($"Users:\\n{list}");
    }
}`;

const serviceLifetimes = `// Program.cs

// Singleton - Shared across all requests (use for stateless services)
builder.Services.AddSingleton<ICacheService, CacheService>();

// Scoped - New instance per update (recommended for DbContext)
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Transient - New instance every time (use for lightweight services)
builder.Services.AddTransient<IEmailService, EmailService>();

// Register Kippo
builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<SessionMiddleware>();`;

const serviceExample = `// Define your service interface
public interface IUserService
{
    Task<User?> GetUserAsync(long telegramId);
    Task<int> GetCountAsync();
    Task SetUserNameAsync(long telegramId, string name);
}

// Implement the service
public class UserService : IUserService
{
    private readonly AppDbContext _db;
    
    public UserService(AppDbContext db)
    {
        _db = db;
    }
    
    public async Task<User?> GetUserAsync(long telegramId)
    {
        return await _db.Users
            .FirstOrDefaultAsync(u => u.TelegramId == telegramId);
    }
    
    public async Task<int> GetCountAsync()
    {
        return await _db.Users.CountAsync();
    }
    
    public async Task SetUserNameAsync(long telegramId, string name)
    {
        var user = await GetUserAsync(telegramId);
        if (user != null)
        {
            user.Name = name;
            await _db.SaveChangesAsync();
        }
    }
}`;

const constructorInjection = `public class MyHandler : BotUpdateHandler
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<MyHandler> _logger;

    public MyHandler(
        IServiceScopeFactory scopeFactory,
        ILogger<MyHandler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    [Command("data")]
    public async Task GetData(Context context)
    {
        // Create a new scope for scoped services
        using var scope = _scopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<IDataService>();
        
        var data = await service.GetDataAsync();
        await context.Reply($"Data: {data}");
    }
}`;

const completeExample = `// Program.cs
using Kippo.Extensions;
using Kippo.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=bot.db"));

// Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<ICacheService, MemoryCacheService>();

// Kippo
builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<SessionMiddleware>();

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();`;

const handlerWithServices = `public class MyHandler : BotUpdateHandler
{
    [Command("start")]
    public async Task Start(Context context, IUserService userService)
    {
        // Check if user exists
        var user = await userService.GetUserAsync(context.ChatId);
        
        if (user == null)
        {
            // Create new user
            await userService.CreateUserAsync(new User
            {
                TelegramId = context.ChatId,
                Username = context.Update.Message?.From?.Username,
                FirstName = context.Update.Message?.From?.FirstName,
                CreatedAt = DateTime.UtcNow
            });
            
            await context.Reply("Welcome! You've been registered.");
        }
        else
        {
            await context.Reply($"Welcome back, {user.FirstName}!");
        }
    }
    
    [Command("premium")]
    public async Task CheckPremium(
        Context context, 
        IUserService userService,
        ISubscriptionService subscriptionService)
    {
        var user = await userService.GetUserAsync(context.ChatId);
        if (user == null)
        {
            await context.Reply("Please /start first");
            return;
        }
        
        var subscription = await subscriptionService.GetActiveAsync(user.Id);
        
        if (subscription != null)
        {
            await context.Reply(
                $"Premium active until {subscription.ExpiresAt:d}");
        }
        else
        {
            await context.Reply("You don't have an active subscription.");
        }
    }
}`;

export function DependencyInjection() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Dependency Injection</h1>
        <p className="text-xl text-zinc-400">
          Kippo fully supports ASP.NET Core's dependency injection. Inject services directly 
          into your handler methods or use constructor injection.
        </p>
      </div>

      {/* New in 1.0.4 */}
      <section className="p-6 rounded-xl border border-green-500/20 bg-green-500/5">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="text-green-500" size={20} />
          New in v1.0.4: Method Parameter Injection
        </h2>
        <p className="text-zinc-400">
          Inject services directly into handler method parameters! The framework automatically 
          resolves services from the DI container and creates proper scopes for scoped services.
        </p>
      </section>

      {/* Method Injection */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Method Parameter Injection</h2>
        <p className="text-zinc-400 mb-6">
          The simplest way to use services - just add them as method parameters:
        </p>
        <CodeBlock code={methodInjection} language="csharp" filename="Method Injection" />
      </section>

      {/* Scoped Services */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Scoped Services (DbContext)</h2>
        <p className="text-zinc-400 mb-6">
          Works seamlessly with scoped services like Entity Framework DbContext:
        </p>
        <CodeBlock code={scopedServices} language="csharp" filename="Scoped Services" />
        
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
          <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-blue-200 text-sm">
            <strong>How it works:</strong> Kippo automatically creates a new service scope for each 
            update, ensuring that scoped services like DbContext are properly disposed after each request.
          </div>
        </div>
      </section>

      {/* Service Lifetimes */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Service Lifetimes</h2>
        <p className="text-zinc-400 mb-6">
          All ASP.NET Core service lifetimes are supported:
        </p>
        <CodeBlock code={serviceLifetimes} language="csharp" filename="Service Lifetimes" />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h4 className="font-semibold text-blue-400 mb-2">Singleton</h4>
            <p className="text-zinc-400 text-sm">
              One instance for the entire application lifetime. Use for stateless services, caching.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h4 className="font-semibold text-green-400 mb-2">Scoped</h4>
            <p className="text-zinc-400 text-sm">
              New instance per update. <strong>Recommended for DbContext</strong> and services with state.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h4 className="font-semibold text-purple-400 mb-2">Transient</h4>
            <p className="text-zinc-400 text-sm">
              New instance every time. Use for lightweight, stateless services.
            </p>
          </div>
        </div>
      </section>

      {/* Creating Services */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Creating Services</h2>
        <p className="text-zinc-400 mb-6">
          Example of creating a service with its interface:
        </p>
        <CodeBlock code={serviceExample} language="csharp" filename="UserService.cs" />
      </section>

      {/* Constructor Injection */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Constructor Injection (Alternative)</h2>
        <p className="text-zinc-400 mb-6">
          You can also use constructor injection with <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">IServiceScopeFactory</code>:
        </p>
        <CodeBlock code={constructorInjection} language="csharp" filename="Constructor Injection" />
        
        <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
          <Info className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-yellow-200 text-sm">
            <strong>Recommendation:</strong> Use method parameter injection for cleaner code. 
            Constructor injection is useful when you need to share state across methods or 
            need more control over service scopes.
          </div>
        </div>
      </section>

      {/* Complete Example */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Complete Example</h2>
        <p className="text-zinc-400 mb-6">
          A complete example with database and services:
        </p>
        
        <h3 className="text-lg font-semibold text-white mt-6 mb-4">Program.cs</h3>
        <CodeBlock code={completeExample} language="csharp" filename="Program.cs" />
        
        <h3 className="text-lg font-semibold text-white mt-6 mb-4">Handler with Services</h3>
        <CodeBlock code={handlerWithServices} language="csharp" filename="MyHandler.cs" />
      </section>

      {/* Best Practices */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Best Practices</h2>
        <ul className="space-y-3 text-zinc-400">
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Use <strong>Scoped</strong> lifetime for DbContext and services that hold state per request</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Use <strong>Singleton</strong> for stateless services and caching</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Prefer method parameter injection over constructor injection for cleaner code</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Use interfaces for services to enable testing and flexibility</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-500 mt-1">!</span>
            <span>Don't inject scoped services into singletons - it will cause issues</span>
          </li>
        </ul>
      </section>

      {/* Navigation */}
      <section className="flex gap-4">
        <Link
          to="/middleware"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Middleware</p>
          </div>
        </Link>
        <Link
          to="/configuration"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Configuration</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
