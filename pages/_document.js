import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                
                function isMetaMaskError(error) {
                  if (!error) return false;
                  var message = (error.message || error.toString() || '').toLowerCase();
                  var stack = (error.stack || '').toLowerCase();
                  var name = (error.name || '').toLowerCase();
                  var errorString = message + ' ' + stack + ' ' + name;
                  
                  return errorString.includes('metamask') ||
                         errorString.includes('failed to connect') ||
                         errorString.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn') ||
                         errorString.includes('ethereum');
                }
                
                var originalOnError = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  if (typeof message === 'string' && (
                    message.toLowerCase().includes('metamask') || 
                    message.toLowerCase().includes('failed to connect')
                  )) {
                    console.warn('[MetaMask] Error suppressed in _document:', message);
                    return true;
                  }
                  
                  if (error && isMetaMaskError(error)) {
                    console.warn('[MetaMask] Error suppressed in _document:', error.message);
                    return true;
                  }
                  
                  if (originalOnError) {
                    return originalOnError.call(this, message, source, lineno, colno, error);
                  }
                  
                  return false;
                };
                
                window.addEventListener('error', function(event) {
                  if (isMetaMaskError(event.error) || 
                      (typeof event.message === 'string' && event.message.toLowerCase().includes('metamask'))) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    console.warn('[MetaMask] Error event suppressed in _document');
                    return false;
                  }
                }, true);
                
                window.addEventListener('unhandledrejection', function(event) {
                  if (isMetaMaskError(event.reason)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    console.warn('[MetaMask] Promise rejection suppressed in _document');
                    return false;
                  }
                }, true);
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

