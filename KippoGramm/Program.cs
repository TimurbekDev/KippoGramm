using Kippo.Extensions;
using Kippo.Middleware;
using KippoGramm;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
// Register Kippo with your bot handler
services.AddSingleton<IUserService,UserService>();
services.AddKippo<MyHandler>(builder.Configuration)
                .AddKippoMiddleware<LoggingMiddleware>()
                .AddKippoMiddleware<SessionMiddleware>();

var app = builder.Build();

app.Run();
