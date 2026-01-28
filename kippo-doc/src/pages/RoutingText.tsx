import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const basicText = `[Text]
public async Task HandleAnyText(Context context)
{
    await context.Reply($"You said: {context.Message.Text}");
}`;

const patternMatch = `[Text(Pattern = "Hello")]
public async Task SayHello(Context context)
{
    await context.Reply("Hi there!");
}`;

const containsMatch = `[Text(Contains = "help")]
public async Task ShowHelp(Context context)
{
    await context.Reply("Need help? Ask me anything!");
}`;

const regexMatch = `[Text(Regex = @"^\\d+$")]
public async Task HandleNumbers(Context context)
{
    await context.Reply("That's a number!");
}`;

const stateMatch = `[Text(State = "awaiting_name")]
public async Task HandleName(Context context)
{
    context.Session!.Data["name"] = context.Message.Text;
    context.Session.State = null;
    await context.Reply("Name saved!");
}`;

const combinedMatch = `[Text(State = "awaiting_age", Regex = @"^\\d+$")]
public async Task HandleAge(Context context)
{
    var age = int.Parse(context.Message.Text!);
    context.Session!.Data["age"] = age;
    context.Session.State = null;
    await context.Reply($"Age {age} saved!");
}`;

export function RoutingText() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">[Text] Attribute</h1>
        <p className="text-xl text-zinc-400">
          Handle text messages with flexible pattern matching and state-based routing.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Catch All Text</h2>
        <p className="text-zinc-400 mb-4">
          Handle any text message (lowest priority):
        </p>
        <CodeBlock code={basicText} language="csharp" filename="Catch All" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Exact Pattern Match</h2>
        <p className="text-zinc-400 mb-4">
          Match exact text (case-insensitive):
        </p>
        <CodeBlock code={patternMatch} language="csharp" filename="Pattern Match" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Contains Match</h2>
        <p className="text-zinc-400 mb-4">
          Match text containing a substring:
        </p>
        <CodeBlock code={containsMatch} language="csharp" filename="Contains Match" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Regex Match</h2>
        <p className="text-zinc-400 mb-4">
          Match text using regular expressions:
        </p>
        <CodeBlock code={regexMatch} language="csharp" filename="Regex Match" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">State-Based Routing</h2>
        <p className="text-zinc-400 mb-4">
          Handle text only when session is in a specific state:
        </p>
        <CodeBlock code={stateMatch} language="csharp" filename="State Match" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Combined Conditions</h2>
        <p className="text-zinc-400 mb-4">
          Combine state with pattern matching:
        </p>
        <CodeBlock code={combinedMatch} language="csharp" filename="Combined" />
      </section>

      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Priority Order</h2>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400">
          <li><strong className="text-white">State + Pattern/Contains/Regex</strong> - Highest priority</li>
          <li><strong className="text-white">State only</strong> - Second priority</li>
          <li><strong className="text-white">Pattern/Contains/Regex only</strong> - Third priority</li>
          <li><strong className="text-white">No conditions [Text]</strong> - Lowest priority</li>
        </ol>
      </section>

      <section className="flex gap-4">
        <Link
          to="/routing/commands"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Commands</p>
          </div>
        </Link>
        <Link
          to="/routing/callbacks"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Callback Queries</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
