import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { AppProvider } from './context/useContext.jsx';
import { SocketProvider } from './context/socketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AppProvider>
  </React.StrictMode>,
)
