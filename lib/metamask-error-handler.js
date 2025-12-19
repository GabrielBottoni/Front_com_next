export const isMetaMaskError = (error) => {
  if (!error) return false;
  
  const message = error.message || error.toString() || '';
  const stack = error.stack || '';
  const name = error.name || '';
  
  const metamaskPatterns = [
    'MetaMask',
    'metamask',
    'Failed to connect',
    'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn',
    'ethereum',
    'web3',
  ];
  
  const errorString = `${message} ${stack} ${name}`.toLowerCase();
  
  return metamaskPatterns.some(pattern => 
    errorString.includes(pattern.toLowerCase())
  );
};

export const suppressMetaMaskError = (error) => {
  if (isMetaMaskError(error)) {
    console.warn('[MetaMask] Error suppressed:', error.message || error);
    return true;
  }
  return false;
};

if (typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string' && (
      message.includes('MetaMask') || 
      message.includes('Failed to connect') ||
      message.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
    )) {
      console.warn('[MetaMask] Global error suppressed:', message);
      return true;
    }
    
    if (error && isMetaMaskError(error)) {
      console.warn('[MetaMask] Error suppressed:', error.message);
      return true;
    }
    
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    
    return false;
  };

  window.addEventListener('error', (event) => {
    if (isMetaMaskError(event.error) || 
        (typeof event.message === 'string' && event.message.includes('MetaMask'))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      console.warn('[MetaMask] Error event suppressed:', event.error?.message || event.message);
      return false;
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (isMetaMaskError(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      console.warn('[MetaMask] Promise rejection suppressed:', event.reason?.message);
      return false;
    }
  }, true);

  if (window.ethereum) {
    try {
      window.ethereum.on('error', (error) => {
        if (isMetaMaskError(error)) {
          console.warn('[MetaMask] Ethereum error suppressed:', error.message);
        }
      });
    } catch (e) {
      
    }
  }

  const originalConsoleError = console.error;
  console.error = function(...args) {
    const firstArg = args[0];
    if (isMetaMaskError(firstArg) || 
        (typeof firstArg === 'string' && firstArg.includes('MetaMask'))) {
      console.warn('[MetaMask] Console error suppressed:', firstArg);
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

