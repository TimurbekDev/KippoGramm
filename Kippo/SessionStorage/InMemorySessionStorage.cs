namespace Kippo.SessionStorage;

public class InMemorySessionStore : ISessionStore
{
    private readonly Dictionary<long, Session> _storage = new();

    public Task<Session> GetAsync(long chatId)
    {
        if (!_storage.TryGetValue(chatId, out var session))
        {
            session = new Session();
            _storage[chatId] = session;
        }
        return Task.FromResult(session);
    }

    public Task SaveAsync(long chatId, Session session)
    {
        _storage[chatId] = session;
        return Task.CompletedTask;
    }
}
