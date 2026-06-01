import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import App from './App.tsx';
import './index.css';

// Disable automatic scroll restoration
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Scroll to top on page load
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

// Scroll to top immediately when script loads
setTimeout(() => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
