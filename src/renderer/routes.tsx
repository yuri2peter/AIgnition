import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Page404 from './pages/404';
import AppGuard from './guards/AppGuard';
import { USE_WEB_SERVER } from 'src/common/config';
import { NavigationHack } from './hacks/navigate';
import PageViewPage from './pages/page-view';

const Router = USE_WEB_SERVER ? BrowserRouter : HashRouter;

export default function AppRoutes() {
  return (
    <Router>
      <NavigationHack />
      <Routes>
        <Route path="/" element={<AppGuard />}>
          <Route path="/auth" element={null} />
          <Route path="/" element={null}>
            <Route path="/" element={<PageViewPage />} />
            <Route path="/:id" element={<PageViewPage />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </Router>
  );
}
