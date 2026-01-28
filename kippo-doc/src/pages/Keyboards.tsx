import { CodeBlock } from '../components/CodeBlock';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const replyKeyboardBasic = `var keyboard = ReplyKeyboardBuilder.Create()
    .Button("Option 1")
    .Button("Option 2")
    .Row()  // Start new row
    .Button("Option 3")
    .Button("Option 4")
    .Resize()   // Auto-resize to fit content
    .OneTime()  // Hide after button press
    .Build();

await context.Reply("Choose an option:", keyboard);`;

const replyKeyboardAdvanced = `var keyboard = ReplyKeyboardBuilder.Create()
    // First row
    .Button("📝 Create")
    .Button("📋 List")
    .Row()
    // Second row
    .Button("⚙️ Settings")
    .Button("❌ Cancel")
    .Row()
    // Special buttons
    .LocationButton("📍 Share Location")
    .ContactButton("📱 Share Contact")
    .Resize()
    .Placeholder("Select an action...")
    .Build();

await context.Reply("Main Menu:", keyboard);`;

const removeKeyboard = `// Remove the reply keyboard
await context.Reply("Keyboard removed", new ReplyKeyboardRemove());`;

const inlineKeyboardBasic = `var keyboard = InlineKeyboardBuilder.Create()
    .Button("✅ Yes", "answer_yes")
    .Button("❌ No", "answer_no")
    .Row()
    .Button("📊 View Stats", "stats")
    .Build();

await context.Reply("Do you agree?", keyboard);`;

const inlineKeyboardAdvanced = `var keyboard = InlineKeyboardBuilder.Create()
    // Callback buttons
    .Button("🏠 Home", "nav_home")
    .Button("⚙️ Settings", "nav_settings")
    .Row()
    
    // URL button
    .UrlButton("📖 Documentation", "https://docs.example.com")
    .Row()
    
    // Pagination example
    .Button("⬅️ Prev", "page_prev")
    .Button("1 / 10", "page_info")
    .Button("➡️ Next", "page_next")
    .Build();

await context.Reply("Navigation Menu:", keyboard);`;

const callbackHandling = `// Create keyboard with callback data
var keyboard = InlineKeyboardBuilder.Create()
    .Button("Product A", "product_a")
    .Button("Product B", "product_b")
    .Row()
    .Button("View Cart", "cart_view")
    .Build();

await context.Reply("Select a product:", keyboard);

// Handle callbacks with wildcard pattern
[CallbackQuery("product_*")]
public async Task HandleProduct(Context context)
{
    var productId = context.Callback.Data.Replace("product_", "");
    
    // Answer callback to remove loading state
    await context.Callback.Answer($"Added {productId} to cart!");
    
    // Update the message or send new one
    await context.Reply($"You selected: {productId}");
}

[CallbackQuery("cart_view")]
public async Task ViewCart(Context context)
{
    await context.Callback.Answer();
    await context.Reply("Your cart is empty");
}`;

const dynamicKeyboard = `[Command("products")]
public async Task ShowProducts(Context context)
{
    // Example: Build keyboard from data
    var products = new[] { "Apple", "Banana", "Orange", "Mango" };
    
    var builder = InlineKeyboardBuilder.Create();
    
    for (int i = 0; i < products.Length; i++)
    {
        builder.Button(products[i], $"buy_{products[i].ToLower()}");
        
        // Add row after every 2 buttons
        if ((i + 1) % 2 == 0 && i < products.Length - 1)
        {
            builder.Row();
        }
    }
    
    var keyboard = builder.Build();
    
    await context.Reply("Available products:", keyboard);
}`;

const paginationExample = `public async Task ShowPage(Context context, int page, int totalPages)
{
    var keyboard = InlineKeyboardBuilder.Create();
    
    // Navigation buttons
    if (page > 1)
        keyboard.Button("⬅️ Previous", $"page_{page - 1}");
    
    keyboard.Button($"{page} / {totalPages}", "page_current");
    
    if (page < totalPages)
        keyboard.Button("Next ➡️", $"page_{page + 1}");
    
    await context.Reply($"Page {page} content here", keyboard.Build());
}

[CallbackQuery("page_*")]
public async Task HandlePagination(Context context)
{
    var pageStr = context.Callback.Data.Replace("page_", "");
    
    if (pageStr == "current")
    {
        await context.Callback.Answer("You're on this page");
        return;
    }
    
    if (int.TryParse(pageStr, out var page))
    {
        await context.Callback.Answer();
        await ShowPage(context, page, 10);
    }
}`;

export function Keyboards() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Keyboards</h1>
        <p className="text-xl text-zinc-400">
          Create interactive keyboards with Kippo's fluent builder API. 
          Support for both reply keyboards and inline keyboards.
        </p>
      </div>

      {/* Overview */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold text-white mb-4">Keyboard Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <h3 className="font-semibold text-blue-400 mb-2">Reply Keyboard</h3>
            <p className="text-zinc-400 text-sm mb-3">
              Appears at the bottom of the chat, replacing the standard keyboard.
            </p>
            <ul className="text-zinc-500 text-sm space-y-1">
              <li>• Text buttons that send messages</li>
              <li>• Can request location or contact</li>
              <li>• Persistent or one-time</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <h3 className="font-semibold text-purple-400 mb-2">Inline Keyboard</h3>
            <p className="text-zinc-400 text-sm mb-3">
              Attached directly to messages with callback buttons.
            </p>
            <ul className="text-zinc-500 text-sm space-y-1">
              <li>• Callback buttons with data</li>
              <li>• URL buttons</li>
              <li>• Stays with the message</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Reply Keyboard */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Reply Keyboard</h2>
        <p className="text-zinc-400 mb-6">
          Create reply keyboards that appear at the bottom of the chat:
        </p>
        <CodeBlock code={replyKeyboardBasic} language="csharp" filename="Basic Reply Keyboard" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Advanced Options</h3>
        <CodeBlock code={replyKeyboardAdvanced} language="csharp" filename="Advanced Reply Keyboard" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">ReplyKeyboardBuilder Methods</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 text-zinc-400">Method</th>
                <th className="text-left py-2 text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Button(text)</td>
                <td className="py-2 text-zinc-400">Add a text button</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">LocationButton(text)</td>
                <td className="py-2 text-zinc-400">Add a button that requests user's location</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">ContactButton(text)</td>
                <td className="py-2 text-zinc-400">Add a button that requests user's contact</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Row()</td>
                <td className="py-2 text-zinc-400">Start a new row of buttons</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Resize()</td>
                <td className="py-2 text-zinc-400">Auto-resize keyboard to fit content</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">OneTime()</td>
                <td className="py-2 text-zinc-400">Hide keyboard after button press</td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-mono">Placeholder(text)</td>
                <td className="py-2 text-zinc-400">Set input field placeholder text</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Remove Keyboard</h3>
        <CodeBlock code={removeKeyboard} language="csharp" filename="Remove Keyboard" />
      </section>

      {/* Inline Keyboard */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Inline Keyboard</h2>
        <p className="text-zinc-400 mb-6">
          Create inline keyboards attached to messages:
        </p>
        <CodeBlock code={inlineKeyboardBasic} language="csharp" filename="Basic Inline Keyboard" />
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Advanced Layout</h3>
        <CodeBlock code={inlineKeyboardAdvanced} language="csharp" filename="Advanced Inline Keyboard" />
        
        <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-white mb-3">InlineKeyboardBuilder Methods</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 text-zinc-400">Method</th>
                <th className="text-left py-2 text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">Button(text, callbackData)</td>
                <td className="py-2 text-zinc-400">Add a callback button</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 text-blue-400 font-mono">UrlButton(text, url)</td>
                <td className="py-2 text-zinc-400">Add a URL button that opens a link</td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-mono">Row()</td>
                <td className="py-2 text-zinc-400">Start a new row of buttons</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Handling Callbacks */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Handling Callbacks</h2>
        <p className="text-zinc-400 mb-6">
          Handle inline keyboard button clicks with the [CallbackQuery] attribute:
        </p>
        <CodeBlock code={callbackHandling} language="csharp" filename="Callback Handling" />
      </section>

      {/* Dynamic Keyboards */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Dynamic Keyboards</h2>
        <p className="text-zinc-400 mb-6">
          Build keyboards dynamically from data:
        </p>
        <CodeBlock code={dynamicKeyboard} language="csharp" filename="Dynamic Keyboard" />
      </section>

      {/* Pagination Example */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Pagination Example</h2>
        <p className="text-zinc-400 mb-6">
          Implement pagination with inline keyboards:
        </p>
        <CodeBlock code={paginationExample} language="csharp" filename="Pagination" />
      </section>

      {/* Navigation */}
      <section className="flex gap-4">
        <Link
          to="/context"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <ArrowLeft className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <div className="text-right">
            <span className="text-zinc-500 text-sm">Previous</span>
            <p className="text-white font-medium">Context API</p>
          </div>
        </Link>
        <Link
          to="/sessions"
          className="flex-1 flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors group"
        >
          <div>
            <span className="text-zinc-500 text-sm">Next</span>
            <p className="text-white font-medium">Sessions</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" size={18} />
        </Link>
      </section>
    </div>
  );
}
