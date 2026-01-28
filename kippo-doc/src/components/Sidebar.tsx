import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Rocket, 
  Command, 
  MessageSquare, 
  Keyboard, 
  Database, 
  Layers, 
  Code2, 
  Zap,
  Settings,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  items?: { title: string; href: string }[];
}

const navigation: NavItem[] = [
  { title: 'Introduction', href: '/', icon: <Home size={18} /> },
  { title: 'Quick Start', href: '/quick-start', icon: <Rocket size={18} /> },
  { 
    title: 'Routing', 
    href: '/routing', 
    icon: <Command size={18} />,
    items: [
      { title: 'Commands', href: '/routing/commands' },
      { title: 'Text Messages', href: '/routing/text' },
      { title: 'Callback Queries', href: '/routing/callbacks' },
    ]
  },
  { title: 'Context API', href: '/context', icon: <Code2 size={18} /> },
  { title: 'Keyboards', href: '/keyboards', icon: <Keyboard size={18} /> },
  { title: 'Sessions', href: '/sessions', icon: <Database size={18} /> },
  { title: 'Middleware', href: '/middleware', icon: <Layers size={18} /> },
  { title: 'Dependency Injection', href: '/dependency-injection', icon: <Zap size={18} /> },
  { title: 'Configuration', href: '/configuration', icon: <Settings size={18} /> },
  { title: 'Examples', href: '/examples', icon: <MessageSquare size={18} /> },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-zinc-800 bg-zinc-950/50 overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Kippo</h1>
            <p className="text-xs text-zinc-500">v1.0.4</p>
          </div>
        </Link>
      </div>

      <nav className="px-3 pb-6">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.items?.some(sub => location.pathname === sub.href));
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {item.icon}
                  {item.title}
                  {item.items && (
                    <ChevronRight 
                      size={14} 
                      className={`ml-auto transition-transform ${isActive ? 'rotate-90' : ''}`} 
                    />
                  )}
                </Link>
                {item.items && isActive && (
                  <ul className="ml-6 mt-1 space-y-1 border-l border-zinc-800 pl-3">
                    {item.items.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          to={subItem.href}
                          className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                            location.pathname === subItem.href
                              ? 'text-blue-400'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Resources
          </h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.nuget.org/packages/Kippo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <ExternalLink size={18} />
                NuGet Package
              </a>
            </li>
            <li>
              <a
                href="https://github.com/TimurbekDev/KippoGramm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <ExternalLink size={18} />
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://core.telegram.org/bots/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <ExternalLink size={18} />
                Telegram Bot API
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
