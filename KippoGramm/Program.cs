using Kippo.Extensions;
using Kippo.Middleware;
using KippoGramm;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
// Register Kippo with your bot handler
services.AddSingleton<IUserService,UserService>();
services.AddKippoLocalization(SupportedLocales.Locales);
services.AddKippo<MyHandler>(builder.Configuration, 
        languageAsker:true, 
        supportedLanguages: ["uz-Latn", "ru-Ru"])
    .AddKippoMiddleware<LoggingMiddleware>()
    .AddKippoMiddleware<SessionMiddleware>();



var app = builder.Build();
app.UseRequestLocalization();

app.Run();
