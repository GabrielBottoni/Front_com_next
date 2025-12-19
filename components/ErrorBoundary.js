import React from 'react'
import { isMetaMaskError } from '../lib/metamask-error-handler'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    if (isMetaMaskError(error)) {
      console.warn('[MetaMask] Error caught by ErrorBoundary:', error.message)
      return { hasError: false, error: null }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (isMetaMaskError(error)) {
      console.warn('[MetaMask] Error suppressed by ErrorBoundary')
      return
    }

    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Algo deu errado</h2>
          <p>Por favor, recarregue a página.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

