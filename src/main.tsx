import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.tsx'

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('./services/mocks/browser');

  // Start the worker and wait for it to be ready
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests (like vite stuff)
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // For easier debugging
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
