namespace Kippo.SessionStorage;

public class Session
{
    public long UserId { get; set; }
    public string? State { get; set; }
    public Dictionary<string, object> Data { get; set; } = new();
}
