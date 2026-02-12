# 🤖 Kippo

[![NuGet](https://img.shields.io/nuget/v/Kippo.svg)](https://www.nuget.org/packages/Kippo/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![.NET](https://img.shields.io/badge/.NET-8.0%20%7C%209.0%20%7C%2010.0-purple.svg)](https://dotnet.microsoft.com/)

A lightweight, attribute-based framework for building Telegram bots in .NET.

## 📦 Quick Install

```bash
dotnet add package Kippo
```

## 🚀 Quick Start

```csharp
[Command("start")]
public async Task Start(Context context)
{
    await context.Reply("Hello! 👋");
}
```

## 📖 Documentation

🌐 **Full Documentation & Guides:** [https://kippo.uz](https://kippo.uz)

## 📁 Repository Structure

- **`/Kippo`** - Main framework library
- **`/KippoGramm`** - Sample application with examples

## 📄 License

MIT License - see [LICENSE](LICENSE)
