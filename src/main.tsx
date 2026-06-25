import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-ignore
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* @ts-ignore */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
