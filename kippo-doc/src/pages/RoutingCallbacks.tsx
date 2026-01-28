import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const exactMatch = `[CallbackQuery("confirm")]
public async Task HandleConfirm(Context context)
{
    await context.Callback.Answer("Confirmed!");
    await context.Reply("Action confirmed");
}`;

const prefixMatch = `[CallbackQuery("page_*")]
public async Task HandlePage(Context context)
{
    var page = context.Callback.Data.Replace("page_", "");
    await context.Callback.Answer();
    await context.Reply($"Showing page {page}");
}`;

const wildcardMatch = `[CallbackQuery("*")]
public async Task HandleAnyCallback(Context context)
{
    await context.Callback.Answer();
}`;

const answerOptions = `[CallbackQuery("action_*")]
public async Task HandleAction(Context context)
{
    // Simple answer (removes loading indicator)
    await context.Callback.Answer();
    
    // Answer with notification
    await context.Callback.Answer("Action completed!");
    
    // Answer with alert popup
    await context.Callback.Answer("Important!", showAlert: true);
    
    // Answer with URL
    await context.Callback.Answer(url: "https://example.com");
}`;

const createKeyboard = `[Command("menu")]
public async Task ShowMenu(Context context)
{
    var keyboard = InlineKeyboardBuilder.Create()
        .Button("Option A", "select_a")
        .Button("Option B", "select_b")
        .Row()
        .Button("Cancel", "cancel")
        .Build();
    
    await context.Reply("Choose an option:", keyboard);
}

[CallbackQuery("select_*")]
public async Task HandleSelect(Context context)
{
    var option = context.Callback.Data.Replace("select_", "");
    await context.Callback.Answer($"Selected: {option}");
    await context.Reply($"You selected option {option.ToUpper()}");
}

[CallbackQuery("cancel")]
public async Task HandleCancel(Context context)
{
    await context.Callback.Answer("Cancelled");
    await context.Reply("Operation cancelled");
}`;

export function RoutingCallbacks() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">[CallbackQuery] Attribute</h1>
        <p className="text-xl text-zinc-400">
          Handle inline keyboard button clicks with pattern matching.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Exact Match</h2>
        <CodeBlock code={exactMatch} language="csharp" filename="Exact Match" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Prefix Match (Wildcard)</h2>
        <p className="text-zinc-400 mb-4">
          Use <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">*</code> at the end to match prefixes:
        </p>
        <CodeBlock code={prefixMatch} language="csharp" filename="Prefix Match" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Match Any Callback</h2>
        <CodeBlock code={wildcardMatch} language="csharp" filename="Wildcard" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Answer Options</h2>
        <p className="text-zinc-400 mb-4">
          Different ways to answer a callback query:
        </p>
        <CodeBlock code={answerOptions} language="csharp" filename="Answer Options" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Complete Example</h2>
        <p className="text-zinc-400 mb-4">
          Creating a keyboard and handling callbacks:
        </p>
        <CodeBlock code={createKeyboard} language="csharp" filename="Complete Example" />
      </section>

      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Pattern Matching</h2>
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
              <td className="py-2 text-zinc-400">Exact: "confirm"</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-2 text-blue-400 font-mono">"page_*"</td>
              <td className="py-2 text-zinc-400">Prefix: "page_1", "page_next"</td>
            </tr>
            <tr>
              <td className="py-2 text-blue-400 font-mono">"*"</td>
              <td className="py-2 text-zinc-400">Any callback data</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="flex gap-4">
        <Link
          to="/routing/text"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Text Messages</p>
          </div>
        </Link>
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
