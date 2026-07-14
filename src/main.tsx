import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-ignore
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'motion/react';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* @ts-ignore */}
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </HelmetProvider>
  </StrictMode>,
);
