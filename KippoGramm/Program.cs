using Kippo.Extensions;
using Kippo.Middleware;
using KippoGramm;

var builder = WebApplication.CreateBuilder(args);

// Register Kippo with your bot handler
builder.Services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<LoggingMiddleware>()
                .AddKippoMiddleware<SessionMiddleware>();

var app = builder.Build();

app.Run();
