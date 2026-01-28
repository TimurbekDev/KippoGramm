import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const contextOverview = `public async Task MyHandler(Context context)
{
    // Bot client - access to Telegram Bot API
    var bot = context.BotClient;
    var me = await bot.GetMeAsync();
    
    // Update information
    var update = context.Update;
    var updateType = update.Type;
    
    // Message data
    var message = context.Message;
    var text = context.Message.Text;
    var chatId = context.ChatId;
    
    // User information
    var user = context.Update.Message?.From;
    var userId = user?.Id;
    var username = user?.Username;
    
    // Session management
    context.Session!.State = "processing";
    context.Session.Data["key"] = "value";
    
    // Send messages
    await context.Reply("Simple text");
    await context.Reply("Text with keyboard", keyboard);
    
    // Callback queries
    await context.Callback.Answer();
    await context.Callback.Answer("Notification text", showAlert: true);
    
    // Get callback data
    var data = context.Callback.Data;
}`;

const replyExamples = `// Simple text reply
await context.Reply("Hello, World!");

// Reply with keyboard
var keyboard = ReplyKeyboardBuilder.Create()
    .Button("Option 1")
    .Button("Option 2")
    .Build();

await context.Reply("Choose an option:", keyboard);

// Reply with inline keyboard
var inlineKeyboard = InlineKeyboardBuilder.Create()
    .Button("Click me", "button_clicked")
    .Build();

await context.Reply("Click the button:", inlineKeyboard);

// Reply with parse mode
await context.Reply("*Bold* and _italic_ text", parseMode: ParseMode.Markdown);`;

const callbackContextExample = `[CallbackQuery("action_*")]
public async Task HandleAction(Context context)
{
    // Get callback data
    var data = context.Callback.Data; // e.g., "action_confirm"
    
    // Answer callback (removes loading indicator)
    await context.Callback.Answer();
    
    // Answer with notification
    await context.Callback.Answer("Action completed!");
    
    // Answer with alert popup
    await context.Callback.Answer("Important message!", showAlert: true);
    
    // Answer with URL (opens link)
    await context.Callback.Answer(url: "https://example.com");
}`;

const messageContextExample = `[Text]
public async Task HandleText(Context context)
{
    // Get message text
    var text = context.Message.Text;
    
    // Message is a wrapper around Update.Message
    // Provides convenient access to common properties
}`;

const sessionExample = `[Command("start")]
public async Task Start(Context context)
{
    // Set session state
    context.Session!.State = "awaiting_input";
    
    // Store data in session
    context.Session.Data["user_name"] = "John";
    context.Session.Data["counter"] = 0;
    
    // Retrieve data
    var name = context.Session.Data["user_name"];
    
    // Check if key exists
    if (context.Session.Data.ContainsKey("counter"))
    {
        var counter = (int)context.Session.Data["counter"];
    }
    
    // Clear session
    context.Session.State = null;
    context.Session.Data.Clear();
}`;

const advancedBotClient = `[Command("photo")]
public async Task SendPhoto(Context context)
{
    // Access the full Telegram Bot Client
    var bot = context.BotClient;
    
    // Send photo
    await bot.SendPhoto(
        chatId: context.ChatId,
        photo: InputFile.FromUri("https://example.com/photo.jpg"),
        caption: "Here's a photo!"
    );
    
    // Send document
    await bot.SendDocument(
        chatId: context.ChatId,
        document: InputFile.FromUri("https://example.com/file.pdf")
    );
    
    // Send location
    await bot.SendLocation(
        chatId: context.ChatId,
        latitude: 40.7128,
        longitude: -74.0060
    );
    
    // Edit message
    await bot.EditMessageText(
        chatId: context.ChatId,
        messageId: messageId,
        text: "Updated text"
    );
    
    // Delete message
    await bot.DeleteMessage(
        chatId: context.ChatId,
        messageId: messageId
    );
}`;

export function ContextPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Context API</h1>
        <p className="text-xl text-zinc-400">
          The Context object is your gateway to all bot interactions. It provides access to 
          the update, bot client, session, and convenient helper methods.
        </p>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
        <CodeBlock code={contextOverview} language="csharp" filename="Context Usage" />
      </section>

      {/* Properties Table */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Context Properties</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-3 text-zinc-400">Property</th>
              <th className="text-left py-3 text-zinc-400">Type</th>
              <th className="text-left py-3 text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-800">
              <td className="py-3 text-blue-400 font-mono">BotClient</td>
              <td className="py-3 text-zinc-300">ITelegramBotClient</td>
              <td className="py-3 text-zinc-400">Full access to Telegram Bot API</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-3 text-blue-400 font-mono">Update</td>
              <td className="py-3 text-zinc-300">Update</td>
              <td className="py-3 text-zinc-400">The raw Telegram update object</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-3 text-blue-400 font-mono">ChatId</td>
              <td className="py-3 text-zinc-300">long</td>
              <td className="py-3 text-zinc-400">Current chat ID (auto-detected from update)</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-3 text-blue-400 font-mono">Message</td>
              <td className="py-3 text-zinc-300">MessageContext</td>
              <td className="py-3 text-zinc-400">Message context with Text property</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-3 text-blue-400 font-mono">Callback</td>
              <td className="py-3 text-zinc-300">CallbackContext</td>
              <td className="py-3 text-zinc-400">Callback query context with Answer() and Data</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-3 text-blue-400 font-mono">Session</td>
              <td className="py-3 text-zinc-300">Session?</td>
              <td className="py-3 text-zinc-400">User session (available with SessionMiddleware)</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-3 text-blue-400 font-mono">SessionStore</td>
              <td className="py-3 text-zinc-300">ISessionStore</td>
              <td className="py-3 text-zinc-400">Session storage interface</td>
            </tr>
            <tr>
              <td className="py-3 text-blue-400 font-mono">CancellationToken</td>
              <td className="py-3 text-zinc-300">CancellationToken</td>
              <td className="py-3 text-zinc-400">Cancellation token for async operations</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Reply Method */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Reply Method</h2>
        <p className="text-zinc-400 mb-6">
          The <code className="px-2 py-1 rounded bg-zinc-800 text-blue-400">Reply()</code> method 
          is a convenient way to send messages to the current chat:
        </p>
        <CodeBlock code={replyExamples} language="csharp" filename="Reply Examples" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">Reply Method Signature</h4>
          <CodeBlock 
            code={`Task Reply(
    string text, 
    ReplyMarkup? replyMarkup = null, 
    ParseMode? parseMode = null
)`} 
            language="csharp" 
          />
        </div>
      </section>

      {/* Callback Context */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Callback Context</h2>
        <p className="text-zinc-400 mb-6">
          Handle inline keyboard button clicks with the Callback context:
        </p>
        <CodeBlock code={callbackContextExample} language="csharp" filename="Callback Context" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">CallbackContext Methods</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 text-zinc-400">Method/Property</th>
                <th className="text-left py-2 text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Data</td>
                <td className="py-2 text-zinc-400">Gets the callback data string</td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-mono">Answer(text?, showAlert, url?, cacheTime?)</td>
                <td className="py-2 text-zinc-400">Answers the callback query</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Message Context */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Message Context</h2>
        <p className="text-zinc-400 mb-6">
          Access message data through the Message context:
        </p>
        <CodeBlock code={messageContextExample} language="csharp" filename="Message Context" />
      </section>

      {/* Session */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Session Access</h2>
        <p className="text-zinc-400 mb-6">
          Access user session data through the context (requires SessionMiddleware):
        </p>
        <CodeBlock code={sessionExample} language="csharp" filename="Session Access" />
      </section>

      {/* Advanced Bot Client */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Advanced: Bot Client</h2>
        <p className="text-zinc-400 mb-6">
          For advanced operations, access the full Telegram Bot Client:
        </p>
        <CodeBlock code={advancedBotClient} language="csharp" filename="Bot Client" />
      </section>

      {/* Navigation */}
      <section className="flex gap-4">
        <Link
          to="/routing"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Routing</p>
          </div>
        </Link>
        <Link
          to="/keyboards"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Keyboards</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
