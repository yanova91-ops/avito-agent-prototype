import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from '@avito/i18n-react';
import { ThemeProvider } from '@avito/kitty';
import { App } from './App';
import './styles.css';

class PrototypeErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return <pre style={{ padding: 24, whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</pre>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrototypeErrorBoundary>
      <I18nProvider locale="ru" defaultLocale="ru" messages={{}}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </I18nProvider>
    </PrototypeErrorBoundary>
  </React.StrictMode>,
);
