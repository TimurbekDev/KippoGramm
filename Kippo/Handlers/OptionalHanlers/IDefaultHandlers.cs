using Kippo.Contexs;

namespace Kippo.Handlers.OptionalHanlers;

public interface IDefaultHandlers
{
    Task RequestLanguage(Context context);
}