import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Page404 from './pages/404';
import AppGuard from './guards/AppGuard';
import PageHome from './pages/home';
import { USE_WEB_SERVER } from 'src/common/config';
import { NavigationHack } from './hacks/navigate';

const Router = USE_WEB_SERVER ? BrowserRouter : HashRouter;

export default function AppRoutes() {
  return (
    <Router>
      <NavigationHack />
      <Routes>
        <Route path="/" element={<AppGuard />}>
          <Route path="/login" element={null} />
          <Route path="/" element={null}>
            <Route path="/" element={<PageHome />} />
            <Route path="/:id" element={<PageHome />} />
            <Route path="/system" element={<PageHome />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </Router>
  );
}
