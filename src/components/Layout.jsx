import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AiChat from './chat/AiChat';
import AmbientBackground from './AmbientBackground';
import ScrollProgress from './ScrollProgress';
import WelcomeIntro from './welcome/WelcomeIntro';

export default function Layout() {
  const { pathname } = useLocation();
  // Overlay on the existing homepage only. Layout stays mounted across route changes, so it shows once per page load.
  const [intro, setIntro] = useState(pathname === '/');
  const closeIntro = useCallback(() => setIntro(false), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <AmbientBackground />
      <ScrollProgress />
      <Navbar />
      <main id="main"><Outlet /></main>
      <Footer />
      <AiChat />
      <WelcomeIntro open={intro} onClose={closeIntro} />
    </>
  );
}
