import React, { createContext, useContext, useState, useCallback } from 'react';
import MessageToast from '../components/MessageToast/MessageToast';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((text, type = 'success', duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), duration);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <MessageContext.Provider value={{ message, showMessage, clearMessage }}>
      {children}
      {message && <MessageToast message={message} onClose={clearMessage} />}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext); 