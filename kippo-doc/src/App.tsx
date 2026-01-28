import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { QuickStart } from './pages/QuickStart';
import { Routing } from './pages/Routing';
import { RoutingCommands } from './pages/RoutingCommands';
import { RoutingText } from './pages/RoutingText';
import { RoutingCallbacks } from './pages/RoutingCallbacks';
import { ContextPage } from './pages/Context';
import { Keyboards } from './pages/Keyboards';
import { Sessions } from './pages/Sessions';
import { Middleware } from './pages/Middleware';
import { DependencyInjection } from './pages/DependencyInjection';
import { Configuration } from './pages/Configuration';
import { Examples } from './pages/Examples';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quick-start" element={<QuickStart />} />
          <Route path="routing" element={<Routing />} />
          <Route path="routing/commands" element={<RoutingCommands />} />
          <Route path="routing/text" element={<RoutingText />} />
          <Route path="routing/callbacks" element={<RoutingCallbacks />} />
          <Route path="context" element={<ContextPage />} />
          <Route path="keyboards" element={<Keyboards />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="middleware" element={<Middleware />} />
          <Route path="dependency-injection" element={<DependencyInjection />} />
          <Route path="configuration" element={<Configuration />} />
          <Route path="examples" element={<Examples />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
