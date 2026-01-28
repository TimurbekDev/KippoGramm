import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const commandExample = `[Command("start")]
public async Task Start(Context context)
{
    await context.Reply("Welcome!");
}

[Command("settings", Description = "Bot settings")]
public async Task Settings(Context context)
{
    await context.Reply("Settings menu");
}`;

const textExample = `// Handle all text messages (lowest priority)
[Text]
public async Task HandleAnyText(Context context)
{
    await context.Reply($"You said: {context.Message.Text}");
}

// Match exact text
[Text(Pattern = "Hello")]
public async Task SayHello(Context context)
{
    await context.Reply("Hi there!");
}

// Match text containing substring
[Text(Contains = "help")]
public async Task ShowHelp(Context context)
{
    await context.Reply("Need help? Ask me anything!");
}

// Match with regex
[Text(Regex = @"^\\d+$")]
public async Task HandleNumbers(Context context)
{
    await context.Reply("That's a number!");
}

// State-specific handler (highest priority)
[Text(State = "awaiting_name")]
public async Task HandleName(Context context)
{
    context.Session!.Data["name"] = context.Message.Text;
    await context.Reply("Name saved!");
}`;

const callbackExample = `// Exact match
[CallbackQuery("confirm")]
public async Task HandleConfirm(Context context)
{
    await context.Callback.Answer("Confirmed!");
    await context.Reply("Action confirmed");
}

// Prefix match with wildcard (*)
[CallbackQuery("page_*")]
public async Task HandlePage(Context context)
{
    var page = context.Callback.Data.Replace("page_", "");
    await context.Callback.Answer();
    await context.Reply($"Showing page {page}");
}

// Match any callback
[CallbackQuery("*")]
public async Task HandleAnyCallback(Context context)
{
    await context.Callback.Answer();
}`;

const multipleAttributesExample = `// Handler responds to multiple triggers
[Command("cancel")]
[Text(Pattern = "Cancel")]
[Text(Pattern = "❌ Cancel")]
public async Task Cancel(Context context)
{
    context.Session!.State = null;
    await context.Reply("Operation cancelled");
}`;

export function Routing() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Routing</h1>
        <p className="text-xl text-zinc-400">
          Kippo uses attributes to route Telegram updates to your handler methods. 
          No complex configuration needed - just decorate your methods.
        </p>
      </div>

      {/* Overview */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Routing Attributes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <h3 className="font-semibold text-blue-400 mb-2">[Command]</h3>
            <p className="text-zinc-400 text-sm">Handle bot commands starting with /</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <h3 className="font-semibold text-green-400 mb-2">[Text]</h3>
            <p className="text-zinc-400 text-sm">Handle text messages with pattern matching</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <h3 className="font-semibold text-purple-400 mb-2">[CallbackQuery]</h3>
            <p className="text-zinc-400 text-sm">Handle inline keyboard button clicks</p>
          </div>
        </div>
      </section>

      {/* Command Attribute */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">[Command] Attribute</h2>
        <p className="text-zinc-400 mb-6">
          Handle bot commands (messages starting with <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">/</code>):
        </p>
        <CodeBlock code={commandExample} language="csharp" filename="Commands" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">Properties</h4>
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
                <td className="py-2 text-zinc-400">Optional description for the command</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Text Attribute */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">[Text] Attribute</h2>
        <p className="text-zinc-400 mb-6">
          Handle text messages with flexible pattern matching:
        </p>
        <CodeBlock code={textExample} language="csharp" filename="Text Handlers" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">Properties</h4>
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
                <td className="py-2 text-blue-400 font-mono">Pattern</td>
                <td className="py-2 text-zinc-300">string?</td>
                <td className="py-2 text-zinc-400">Exact text match (case-insensitive)</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Contains</td>
                <td className="py-2 text-zinc-300">string?</td>
                <td className="py-2 text-zinc-400">Text must contain this substring</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Regex</td>
                <td className="py-2 text-zinc-300">string?</td>
                <td className="py-2 text-zinc-400">Regular expression pattern</td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-mono">State</td>
                <td className="py-2 text-zinc-300">string?</td>
                <td className="py-2 text-zinc-400">Only match when session state equals this value</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <h4 className="font-semibold text-blue-400 mb-2">Priority Order</h4>
          <p className="text-zinc-300 text-sm mb-3">
            Text handlers are matched in this priority order:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-sm">
            <li><strong className="text-white">State + Pattern/Contains/Regex</strong> - Highest priority</li>
            <li><strong className="text-white">State only</strong> - Second priority</li>
            <li><strong className="text-white">Pattern/Contains/Regex only</strong> - Third priority</li>
            <li><strong className="text-white">No conditions [Text]</strong> - Lowest priority (catch-all)</li>
          </ol>
        </div>
      </section>

      {/* CallbackQuery Attribute */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">[CallbackQuery] Attribute</h2>
        <p className="text-zinc-400 mb-6">
          Handle inline keyboard button clicks:
        </p>
        <CodeBlock code={callbackExample} language="csharp" filename="Callback Handlers" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">Pattern Matching</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 text-zinc-400">Pattern</th>
                <th className="text-left py-2 text-zinc-400">Matches</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">"confirm"</td>
                <td className="py-2 text-zinc-400">Exact match: "confirm"</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">"page_*"</td>
                <td className="py-2 text-zinc-400">Prefix match: "page_1", "page_2", "page_next"</td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-mono">"*"</td>
                <td className="py-2 text-zinc-400">Matches any callback data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Multiple Attributes */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Multiple Attributes</h2>
        <p className="text-zinc-400 mb-6">
          A single handler can respond to multiple triggers:
        </p>
        <CodeBlock code={multipleAttributesExample} language="csharp" filename="Multiple Triggers" />
      </section>

      {/* Next Steps */}
      <section className="flex gap-4">
        <Link
          to="/context"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Context API</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
