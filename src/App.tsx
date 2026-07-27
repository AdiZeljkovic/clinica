/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import NewsListPage from './pages/NewsListPage';
import NewsArticlePage from './pages/NewsArticlePage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import ImpressumPage from './pages/ImpressumPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

/* Instant scroll-to-top na promjenu rute (hash linkovi preskaču).
   Bez page-level fade-a — remount cijele stranice iz opacity:0 bljesne;
   ulazne animacije rade same stranice (PageHero, revealovi) */
function PageShell() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // anchor linkovi (/#proizvodi) — sačekaj render pa skroluj do sekcije
      const id = hash.slice(1);
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else if (++attempts < 20) setTimeout(tryScroll, 100); // sadržaj se možda još učitava
      };
      requestAnimationFrame(tryScroll);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/products" element={<CategoryPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:id" element={<NewsArticlePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/privatnost" element={<PrivacyPage />} />
        <Route path="/uvjeti" element={<TermsPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <PageShell />
    </Router>
  );
}
