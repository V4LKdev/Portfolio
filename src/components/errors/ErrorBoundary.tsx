/**
 * ErrorBoundary.tsx
 *
 * A top-level React component that catches JavaScript errors anywhere in its
 * child component tree, logs those errors, and displays a fallback UI
 * instead of a crashed component tree.
 */
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: ErrorInfo | undefined;
}

class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: undefined,
    errorInfo: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error and save it to state for display
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4 font-mono">
          <div className="border border-primary/20 bg-card p-8 rounded-lg shadow-xl max-w-lg w-full text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              [ System Failure ]
            </h1>
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred. The application has been halted to
              prevent further issues.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
