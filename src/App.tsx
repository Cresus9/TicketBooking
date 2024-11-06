import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { SecurityProvider } from './context/SecurityContext';
import { NotificationProvider } from './context/NotificationContext';
import { RealtimeProvider } from './context/RealtimeContext';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <SecurityProvider>
              <AdminProvider>
                <EventProvider>
                  <RealtimeProvider>
                    <NotificationProvider>
                      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col">
                        <Navbar />
                        <main className="container mx-auto px-4 py-8 flex-grow">
                          <AppRoutes />
                        </main>
                        <Footer />
                      </div>
                    </NotificationProvider>
                  </RealtimeProvider>
                </EventProvider>
              </AdminProvider>
            </SecurityProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;