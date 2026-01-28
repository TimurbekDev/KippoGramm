import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
