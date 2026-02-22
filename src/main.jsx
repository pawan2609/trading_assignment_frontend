import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          colorSuccess: '#10b981',
          colorError: '#ef4444',
          colorWarning: '#f59e0b',
          colorInfo: '#3b82f6',
          colorBgBase: '#0a0e1a',
          colorBgContainer: 'rgba(14, 18, 32, 0.85)',
          colorBgElevated: 'rgba(20, 26, 46, 0.9)',
          colorBorder: 'rgba(99, 102, 241, 0.12)',
          colorBorderSecondary: 'rgba(99, 102, 241, 0.08)',
          borderRadius: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontFamilyCode: "'JetBrains Mono', monospace",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
