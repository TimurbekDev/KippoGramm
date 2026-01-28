import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const basicCommand = `[Command("start")]
public async Task Start(Context context)
{
    await context.Reply("Welcome!");
}`;

const commandWithDescription = `[Command("settings", Description = "Bot settings")]
public async Task Settings(Context context)
{
    await context.Reply("Settings menu");
}`;

const multipleCommands = `[Command("help")]
[Command("info")]
public async Task HelpOrInfo(Context context)
{
    await context.Reply("Help information");
}`;

const commandWithArgs = `[Command("echo")]
public async Task Echo(Context context)
{
    // Get text after the command
    var text = context.Message.Text;
    var args = text?.Split(' ').Skip(1).ToArray() ?? Array.Empty<string>();
    
    if (args.Length > 0)
    {
        await context.Reply($"You said: {string.Join(" ", args)}");
    }
    else
    {
        await context.Reply("Usage: /echo <text>");
    }
}`;

export function RoutingCommands() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">[Command] Attribute</h1>
        <p className="text-xl text-zinc-400">
          Handle bot commands - messages starting with <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">/</code>
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Basic Usage</h2>
        <CodeBlock code={basicCommand} language="csharp" filename="Basic Command" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">With Description</h2>
        <p className="text-zinc-400 mb-4">
          Add a description for documentation purposes:
        </p>
        <CodeBlock code={commandWithDescription} language="csharp" filename="Command with Description" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Multiple Commands</h2>
        <p className="text-zinc-400 mb-4">
          One handler can respond to multiple commands:
        </p>
        <CodeBlock code={multipleCommands} language="csharp" filename="Multiple Commands" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Command Arguments</h2>
        <p className="text-zinc-400 mb-4">
          Parse arguments from the command:
        </p>
        <CodeBlock code={commandWithArgs} language="csharp" filename="Command with Arguments" />
      </section>

      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Properties</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 text-zinc-400">Property</th>
              <th className="text-left py-2 text-zinc-400">Type</th>
              <th className="text-left py-2 text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-800">
              <td className="py-2 text-blue-400 font-mono">command</td>
              <td className="py-2 text-zinc-300">string</td>
              <td className="py-2 text-zinc-400">Command name without the / prefix</td>
            </tr>
            <tr>
              <td className="py-2 text-blue-400 font-mono">Description</td>
              <td className="py-2 text-zinc-300">string?</td>
              <td className="py-2 text-zinc-400">Optional description</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="flex gap-4">
        <Link
          to="/routing"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Routing Overview</p>
          </div>
        </Link>
        <Link
          to="/routing/text"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Text Messages</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
