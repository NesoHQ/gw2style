import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(10, 14, 26, 0.95), rgba(18, 21, 31, 0.95))',
          padding: '2rem',
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(36, 41, 56, 0.9))',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}>⚠️</div>
            
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              color: '#d4af37',
              fontSize: '2rem',
              marginBottom: '1rem',
            }}>
              Something went wrong
            </h1>
            
            <p style={{
              color: '#a8a29e',
              fontSize: '1.1rem',
              marginBottom: '2rem',
              lineHeight: '1.6',
            }}>
              We encountered an unexpected error. Please try refreshing the page or return to the home page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: '2rem',
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}>
                <summary style={{
                  color: '#d4af37',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  color: '#fca5a5',
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
                  border: '2px solid #f4d03f',
                  borderRadius: '8px',
                  color: '#0a0e1a',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Refresh Page
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '0.875rem 2rem',
                  background: 'transparent',
                  border: '2px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '8px',
                  color: '#d4af37',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(212, 175, 55, 0.1)';
                  e.target.style.borderColor = '#d4af37';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
