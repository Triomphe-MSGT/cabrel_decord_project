import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { ContactSettingsProvider } from './context/ContactSettingsContext';
import './styles/globals.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ContactSettingsProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </ContactSettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
