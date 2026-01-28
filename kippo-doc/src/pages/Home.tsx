import { Link } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import { 
  Zap, 
  Database, 
  Layers, 
  Keyboard, 
  Rocket, 
  Package,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: <Zap className="text-yellow-500" size={24} />,
    title: 'Attribute-Based Routing',
    description: 'Define handlers with simple attributes like [Command], [Text], and [CallbackQuery]. No complex configuration needed.'
  },
  {
    icon: <Database className="text-green-500" size={24} />,
    title: 'Session Management',
    description: 'Built-in session storage tracks user state and data automatically across conversations.'
  },
  {
    icon: <Layers className="text-purple-500" size={24} />,
    title: 'Middleware Pipeline',
    description: 'Add custom middleware for logging, authentication, rate limiting, or any behavior you need.'
  },
  {
    icon: <Keyboard className="text-blue-500" size={24} />,
    title: 'Keyboard Builders',
    description: 'Fluent API for creating reply and inline keyboards with minimal code.'
  },
  {
    icon: <Rocket className="text-red-500" size={24} />,
    title: 'ASP.NET Core Integration',
    description: 'Seamless integration with dependency injection, hosting, and configuration.'
  },
  {
    icon: <Package className="text-cyan-500" size={24} />,
    title: 'Production Ready',
    description: 'Thread-safe session storage, automatic service scoping, and comprehensive error handling.'
  }
];

const quickStartCode = `// 1. Install the package
dotnet add package Kippo

// 2. Create your handler
public class MyHandler : BotUpdateHandler
{
    [Command("start")]
    public async Task Start(Context context)
    {
        await context.Reply("Hello! Welcome to my bot!");
    }
}

// 3. Register in Program.cs
builder.Services.AddKippo<MyHandler>(builder.Configuration);`;

export function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Version 1.0.4 Released
        </div>
        
        <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
          Build Telegram Bots<br />
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            with Elegance
          </span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
          A lightweight, attribute-based framework for creating powerful Telegram bots in .NET 
          with session management, middleware support, and intuitive routing.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/quick-start"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
          <a
            href="https://www.nuget.org/packages/Kippo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors border border-zinc-700"
          >
            <Package size={18} />
            NuGet Package
          </a>
        </div>

        <div className="flex items-center justify-center gap-8 mt-8 text-sm text-zinc-500">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            .NET 8, 9, 10
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            MIT License
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            Production Ready
          </span>
        </div>
      </section>

      {/* Quick Example */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Example</h2>
        <p className="text-zinc-400 mb-6">
          Get your Telegram bot running in just 3 steps:
        </p>
        <CodeBlock code={quickStartCode} language="csharp" filename="Quick Start" />
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8">Why Kippo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-zinc-800">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Installation */}
      <section className="p-8 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
        <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
        <p className="text-zinc-400 mb-6">
          Install Kippo via NuGet Package Manager:
        </p>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-zinc-500 mb-2">.NET CLI</p>
            <CodeBlock code="dotnet add package Kippo" language="bash" />
          </div>
          
          <div>
            <p className="text-sm text-zinc-500 mb-2">Package Manager Console</p>
            <CodeBlock code="Install-Package Kippo" language="powershell" />
          </div>
          
          <div>
            <p className="text-sm text-zinc-500 mb-2">PackageReference</p>
            <CodeBlock code='<PackageReference Include="Kippo" Version="1.0.4" />' language="xml" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Build Your Bot?
        </h2>
        <p className="text-zinc-400 mb-8">
          Follow our step-by-step guide to create your first Telegram bot in under 5 minutes.
        </p>
        <Link
          to="/quick-start"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
        >
          Start Building
          <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
