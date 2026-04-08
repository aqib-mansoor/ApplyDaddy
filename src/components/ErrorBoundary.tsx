import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Daddy's working on it!";
      let isPermissionError = false;

      try {
        const parsedError = JSON.parse(this.state.error?.message || '');
        if (parsedError.error?.includes('insufficient permissions')) {
          errorMessage = "It seems you don't have permission to do that. Are you logged in correctly?";
          isPermissionError = true;
        } else if (parsedError.error?.includes('offline') || parsedError.error?.includes('unavailable') || parsedError.error?.includes('timeout')) {
          errorMessage = "Firestore is currently unreachable. Please check your internet connection and Firebase configuration.";
        }
      } catch {
        if (this.state.error?.message.includes('offline') || this.state.error?.message.includes('unavailable') || this.state.error?.message.includes('timeout')) {
          errorMessage = "Firestore is currently unreachable. Please check your internet connection and Firebase configuration.";
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cream">
          <div className="glass p-8 rounded-3xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-terracotta" size={32} />
            </div>
            <h2 className="text-2xl font-serif text-charcoal mb-4">Oops! Something went wrong</h2>
            <p className="text-warm-gray mb-8">{errorMessage}</p>
            
            {isPermissionError && (
              <div className="bg-terracotta/5 p-4 rounded-xl text-sm text-terracotta mb-8 text-left">
                <p className="font-bold mb-1">Technical Details:</p>
                <p className="font-mono break-all opacity-80">Missing or insufficient permissions.</p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-4 bg-terracotta text-white font-bold rounded-2xl hover:bg-terracotta/90 transition-all shadow-lg shadow-terracotta/20"
            >
              <RefreshCcw size={20} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
