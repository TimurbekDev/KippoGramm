using Kippo.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddKippo<MyHandler>(builder.Configuration);

var app = builder.Build();

app.Run();
