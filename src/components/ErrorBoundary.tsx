import React from 'react';
import { Button } from './ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Something went wrong
            </h2>
            <p className="text-[#666666] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              We're sorry, but there was an error loading the application. Please refresh the page to try again.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-[#6EC18E] hover:bg-[#5BB07F] text-white"
              >
                Refresh Page
              </Button>
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-[#666666]">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}