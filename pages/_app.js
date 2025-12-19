import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import client from '../lib/apollo';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import '../lib/metamask-error-handler';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (window.__NEXT_DATA__ && process.env.NODE_ENV === 'development') {
      const originalErr = window.__NEXT_DATA__.err;
      if (originalErr && typeof originalErr === 'object') {
        const errMessage = (originalErr.message || '').toLowerCase();
        if (errMessage.includes('metamask') || errMessage.includes('failed to connect')) {
          window.__NEXT_DATA__.err = null;
        }
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}