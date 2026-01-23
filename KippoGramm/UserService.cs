namespace KippoGramm;

public interface IUserService
{
    Task<string> GetUserName(long Id);
    Task SetUserName(long Id,string Name);
}

public class UserService : IUserService
{
    private Dictionary<long, string> Users = [];
    public  Task<string> GetUserName(long Id)
    {
        return Task.FromResult(Users.FirstOrDefault(x => x.Key == Id).Value);
    }

    public Task SetUserName(long Id, string Name)
    {
        Users.Add(Id,Name);
        return Task.CompletedTask;
    }
}
