import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../services/api';
import { mergeContact } from '../utils/contactLinks';

const ContactSettingsContext = createContext(null);

export const ContactSettingsProvider = ({ children }) => {
  const [contact, setContact] = useState(() => mergeContact(null));

  const load = useCallback(async () => {
    try {
      const { data } = await settingsApi.getContact();
      setContact(mergeContact(data));
    } catch {
      setContact(mergeContact(null));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ContactSettingsContext.Provider value={{ contact, reloadContact: load }}>
      {children}
    </ContactSettingsContext.Provider>
  );
};

export const useContactSettings = () => {
  const ctx = useContext(ContactSettingsContext);
  if (!ctx) {
    return { contact: mergeContact(null), reloadContact: () => {} };
  }
  return ctx;
};
