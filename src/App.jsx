import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './admin/AuthContext';
import { NotificationsProvider } from './admin/NotificationsContext';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Career = lazy(() => import('./pages/Career'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const ForgotPassword = lazy(() => import('./admin/ForgotPassword'));
const ResetPassword = lazy(() => import('./admin/ResetPassword'));
const ChangePassword = lazy(() => import('./admin/ChangePassword'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const Messages = lazy(() => import('./admin/Messages'));
const MessageDetail = lazy(() => import('./admin/MessageDetail'));

/** One shared unread-count state for the admin navbar and the public footer lock icon; idle unless an admin is signed in. */
function NotificationsGate({ children }) {
  const { admin } = useAuth();
  return <NotificationsProvider enabled={Boolean(admin)}>{children}</NotificationsProvider>;
}

export default function App() {
  return (
    <AuthProvider>
    <NotificationsGate>
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="about" element={<About />} />
          <Route path="career" element={<Career />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route element={<AdminLayout />}>
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:id" element={<MessageDetail />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
    </NotificationsGate>
    </AuthProvider>
  );
}
