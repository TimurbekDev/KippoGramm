# KippoGramm

A lightweight, attribute-based framework for building Telegram bots in .NET.

[![NuGet](https://img.shields.io/nuget/v/Kippo.svg)](https://www.nuget.org/packages/Kippo/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![.NET](https://img.shields.io/badge/.NET-8.0%20%7C%209.0%20%7C%2010.0-purple.svg)](https://dotnet.microsoft.com/)

🌐 **Website:** [https://kippo.uz](https://kippo.uz)

## Projects

This repository contains two projects:

### 📦 Kippo
The main framework library for building Telegram bots.
- Location: `/Kippo`
- See [Kippo/README.md](Kippo/README.md) for full documentation

### 🚀 KippoGramm
Sample application demonstrating how to use the Kippo framework.
- Location: `/KippoGramm`
- Example bot with multi-step conversations and session management

## Quick Start

Install the Kippo package:

```bash
dotnet add package Kippo
```

Create a bot handler:

```csharp
public class MyHandler : BotUpdateHandler
{
    public MyHandler(ISessionStore sessionStore, IEnumerable<IBotMiddleware> middlewares) 
        : base(sessionStore, middlewares) { }

    [Command("start")]
    public async Task Start(Context context)
    {
        await context.Reply("Hello! 👋");
    }
}
```

Register in your application:

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddKippo<MyHandler>(builder.Configuration);
var app = builder.Build();
app.Run();
```

## Features

- 🎯 Attribute-based routing
- 💾 Session management
- 🔌 Middleware support
- ⌨️ Keyboard builders
- 🚀 ASP.NET Core integration

## Documentation

- [Full Documentation](Kippo/README.md)
- [Publishing Guide](Kippo/PUBLISHING.md)
- [Changelog](Kippo/CHANGELOG.md)

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
