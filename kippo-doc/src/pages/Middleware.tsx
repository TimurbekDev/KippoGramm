import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';

const middlewareInterface = `using Kippo.Contexs;

namespace Kippo.Middleware;

public interface IBotMiddleware
{
    Task InvokeAsync(Context context, Func<Task> next);
}`;

const registerMiddleware = `using Kippo.Extensions;
using Kippo.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Register Kippo with middleware
builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<LoggingMiddleware>()
                .AddKippoMiddleware<SessionMiddleware>();

var app = builder.Build();
app.Run();`;

const loggingMiddleware = `using Kippo.Contexs;
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
            "Update received from @{Username} (ID: {UserId}): {UpdateType}",
            username,
            userId,
            context.Update.Type
        );

        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        await next(); // Continue to next middleware or handler
        
        stopwatch.Stop();

        _logger.LogInformation(
            "Update processed in {ElapsedMs}ms",
            stopwatch.ElapsedMilliseconds
        );
    }
}`;

const authMiddleware = `using Kippo.Contexs;
using Kippo.Middleware;

public class AuthMiddleware : IBotMiddleware
{
    private readonly HashSet<long> _allowedUsers;
    private readonly ILogger<AuthMiddleware> _logger;

    public AuthMiddleware(IConfiguration config, ILogger<AuthMiddleware> logger)
    {
        _logger = logger;
        
        // Load allowed users from configuration
        var allowedIds = config.GetSection("Bot:AllowedUsers").Get<long[]>() 
                        ?? Array.Empty<long>();
        _allowedUsers = new HashSet<long>(allowedIds);
    }

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        var userId = context.Update.Message?.From?.Id ?? 
                    context.Update.CallbackQuery?.From?.Id;
        
        if (!userId.HasValue)
        {
            await next();
            return;
        }

        if (_allowedUsers.Count == 0 || _allowedUsers.Contains(userId.Value))
        {
            await next(); // User is authorized
        }
        else
        {
            _logger.LogWarning("Unauthorized access attempt from user {UserId}", userId);
            await context.Reply("Access denied. You are not authorized to use this bot.");
        }
    }
}`;

const rateLimitMiddleware = `using Kippo.Contexs;
using Kippo.Middleware;
using System.Collections.Concurrent;

public class RateLimitMiddleware : IBotMiddleware
{
    private readonly ConcurrentDictionary<long, DateTime> _lastRequest = new();
    private readonly TimeSpan _cooldown;
    private readonly ILogger<RateLimitMiddleware> _logger;

    public RateLimitMiddleware(IConfiguration config, ILogger<RateLimitMiddleware> logger)
    {
        _logger = logger;
        var seconds = config.GetValue<int>("Bot:RateLimitSeconds", 2);
        _cooldown = TimeSpan.FromSeconds(seconds);
    }

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        var userId = context.Update.Message?.From?.Id ?? 
                    context.Update.CallbackQuery?.From?.Id;
        
        if (!userId.HasValue)
        {
            await next();
            return;
        }

        var now = DateTime.UtcNow;
        
        if (_lastRequest.TryGetValue(userId.Value, out var lastTime))
        {
            if (now - lastTime < _cooldown)
            {
                _logger.LogDebug("Rate limit hit for user {UserId}", userId);
                await context.Reply("Please wait before sending another message.");
                return;
            }
        }

        _lastRequest[userId.Value] = now;
        await next();
    }
}`;

const errorHandlingMiddleware = `using Kippo.Contexs;
using Kippo.Middleware;

public class ErrorHandlingMiddleware : IBotMiddleware
{
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        try
        {
            await next();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing update {UpdateId}", context.Update.Id);
            
            try
            {
                await context.Reply("An error occurred. Please try again later.");
            }
            catch
            {
                // Ignore errors when sending error message
            }
        }
    }
}`;

const sessionMiddlewareCode = `using Kippo.Contexs;

namespace Kippo.Middleware;

public class SessionMiddleware : IBotMiddleware
{
    public async Task InvokeAsync(Context context, Func<Task> next)
    {
        long chatId;
        try
        {
            chatId = context.ChatId;
        }
        catch (InvalidOperationException)
        {
            // Update type doesn't have a chat ID
            await next();
            return;
        }
        
        // Load session before handler
        context.Session = await context.SessionStore.GetAsync(chatId);

        await next();

        // Save session after handler
        if (context.Session != null)
        {
            await context.SessionStore.SaveAsync(chatId, context.Session);
        }
    }
}`;

const middlewareOrder = `// Middleware executes in registration order
builder.Services.AddKippo<MyHandler>(builder.Configuration)
    .AddKippoMiddleware<ErrorHandlingMiddleware>()  // 1. Catches all errors
    .AddKippoMiddleware<LoggingMiddleware>()        // 2. Logs requests
    .AddKippoMiddleware<RateLimitMiddleware>()      // 3. Rate limiting
    .AddKippoMiddleware<AuthMiddleware>()           // 4. Authentication
    .AddKippoMiddleware<SessionMiddleware>();       // 5. Session management

// Pipeline flow:
// Request → Error → Logging → RateLimit → Auth → Session → Handler
// Response ← Error ← Logging ← RateLimit ← Auth ← Session ← Handler`;

export function Middleware() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Middleware</h1>
        <p className="text-xl text-zinc-400">
          Extend Kippo's functionality with custom middleware. Middleware executes in a pipeline 
          before your handlers, allowing you to add logging, authentication, rate limiting, and more.
        </p>
      </div>

      {/* How It Works */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">How Middleware Works</h2>
        <p className="text-zinc-400 mb-4">
          Middleware forms a pipeline that processes each update before it reaches your handler:
        </p>
        <div className="p-4 rounded-lg bg-zinc-800/50 font-mono text-sm text-zinc-300">
          <p>Update → Middleware 1 → Middleware 2 → ... → Handler</p>
          <p className="mt-2">Response ← Middleware 1 ← Middleware 2 ← ... ← Handler</p>
        </div>
        <p className="text-zinc-400 mt-4">
          Each middleware can:
        </p>
        <ul className="mt-2 space-y-1 text-zinc-400">
          <li>• Execute code before the handler</li>
          <li>• Call <code className="text-blue-400">next()</code> to continue the pipeline</li>
          <li>• Execute code after the handler</li>
          <li>• Short-circuit the pipeline by not calling <code className="text-blue-400">next()</code></li>
        </ul>
      </section>

      {/* Interface */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">IBotMiddleware Interface</h2>
        <CodeBlock code={middlewareInterface} language="csharp" filename="IBotMiddleware.cs" />
      </section>

      {/* Registration */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Registering Middleware</h2>
        <p className="text-zinc-400 mb-6">
          Use <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">AddKippoMiddleware&lt;T&gt;()</code> to register middleware:
        </p>
        <CodeBlock code={registerMiddleware} language="csharp" filename="Program.cs" />
      </section>

      {/* Built-in Middleware */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Built-in Middleware</h2>
        
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 mb-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">SessionMiddleware</h3>
          <p className="text-zinc-400 mb-4">
            Automatically loads and saves user sessions. Required for session management.
          </p>
          <CodeBlock code={sessionMiddlewareCode} language="csharp" filename="SessionMiddleware.cs" />
        </div>
      </section>

      {/* Custom Middleware Examples */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Custom Middleware Examples</h2>
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Logging Middleware</h3>
        <p className="text-zinc-400 mb-4">
          Log incoming updates and processing time:
        </p>
        <CodeBlock code={loggingMiddleware} language="csharp" filename="LoggingMiddleware.cs" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Authentication Middleware</h3>
        <p className="text-zinc-400 mb-4">
          Restrict bot access to specific users:
        </p>
        <CodeBlock code={authMiddleware} language="csharp" filename="AuthMiddleware.cs" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Rate Limiting Middleware</h3>
        <p className="text-zinc-400 mb-4">
          Prevent spam by limiting request frequency:
        </p>
        <CodeBlock code={rateLimitMiddleware} language="csharp" filename="RateLimitMiddleware.cs" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Error Handling Middleware</h3>
        <p className="text-zinc-400 mb-4">
          Catch and handle errors gracefully:
        </p>
        <CodeBlock code={errorHandlingMiddleware} language="csharp" filename="ErrorHandlingMiddleware.cs" />
      </section>

      {/* Middleware Order */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Middleware Order</h2>
        <p className="text-zinc-400 mb-6">
          Middleware executes in the order it's registered. Order matters!
        </p>
        <CodeBlock code={middlewareOrder} language="csharp" filename="Middleware Order" />
        
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
          <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-blue-200 text-sm">
            <strong>Tip:</strong> Place error handling middleware first so it can catch errors from all other middleware. 
            Place session middleware last so sessions are available in handlers.
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Best Practices</h2>
        <ul className="space-y-3 text-zinc-400">
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Always call <code className="text-blue-400">await next()</code> unless you want to short-circuit</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Use dependency injection for services (ILogger, IConfiguration, etc.)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Keep middleware focused on a single responsibility</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Handle exceptions in error-handling middleware</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Use <code className="text-blue-400">ConcurrentDictionary</code> for thread-safe state</span>
          </li>
        </ul>
      </section>

      {/* Navigation */}
      <section className="flex gap-4">
        <Link
          to="/sessions"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Sessions</p>
          </div>
        </Link>
        <Link
          to="/dependency-injection"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Dependency Injection</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
