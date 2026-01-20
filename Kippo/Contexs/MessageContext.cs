namespace Kippo.Contexs;

public sealed class MessageContext
{
    private readonly Context _context;

    public MessageContext(Context context)
    {
        _context = context;
    }

    public string Text => _context.Update.Message!.Text!;
}
