import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ClientProvider } from './context/ClientContext';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllClients from './pages/AllClients';
import AddClient from './pages/AddClient';
import ClientDetails from './pages/ClientDetails';
import FollowUps from './pages/FollowUps';
import DemoProjects from './pages/DemoProjects';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Categories from './pages/Categories';
import ImportClients from './pages/ImportClients';
import CompletedProjects from './pages/CompletedProjects';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClientProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected App Routes */}
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<AllClients />} />
                <Route path="clients/new" element={<AddClient />} />
                <Route path="clients/:id" element={<ClientDetails />} />
                <Route path="follow-ups" element={<FollowUps />} />
                <Route path="demos" element={<DemoProjects />} />
                <Route path="categories" element={<Categories />} />
                <Route path="import" element={<ImportClients />} />
                <Route path="completed" element={<CompletedProjects />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
