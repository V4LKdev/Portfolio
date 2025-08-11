/**
 * ErrorBoundary.tsx
 *
 * React error boundary component for catching and displaying errors in the UI.
 * Provides a fallback UI and reload option when an error is encountered.
 */
import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  /**
   * React lifecycle: update state to show fallback UI on error.
   */
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  /**
   * React lifecycle: can be used to log errors to a reporting service.
   */
  public override componentDidCatch() {
    // Intentionally left blank; implement logging if needed.
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen w-full flex flex-col items-center justify-center bg-[#181a20] text-white font-mono p-4"
          style={{
            background: "linear-gradient(120deg, #181a20 60%, #23242b 100%)",
          }}
        >
          <div
            className="relative max-w-md w-full text-center p-8 rounded-xl shadow-xl border border-[#2e323c]"
            style={{
              background: "rgba(24, 26, 32, 0.96)",
              boxShadow: "0 4px 32px 0 #000a, 0 1.5px 0 0 #00ffe7 inset",
              backdropFilter: "blur(6px)",
            }}
          >
            <h1
              className="text-2xl md:text-3xl font-bold mb-3 tracking-wider"
              style={{
                color: "#00ffe7",
                letterSpacing: "0.12em",
                textShadow: "0 0 4px #00ffe7cc",
              }}
            >
              SYSTEM ERROR
            </h1>
            <p
              className="mb-7 text-base text-gray-300"
              style={{ textShadow: "0 1px 4px #0008" }}
            >
              An unexpected error has occurred.
              <br />
              <span className="text-[#00ffe7] font-semibold">
                The application has stopped.
              </span>
            </p>
            <button
              onClick={() => {
                // Defer importless: directly reload
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-md font-semibold text-base bg-[#232946] text-[#00ffe7] border border-[#00ffe7] hover:bg-[#00ffe7] hover:text-[#232946] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#00ffe7] focus:ring-offset-2"
              style={{
                boxShadow: "0 2px 12px 0 #00ffe720",
              }}
            >
              Reload
            </button>
            <div className="mt-7 text-xs text-gray-500 opacity-70 select-none">
              If this keeps happening, please contact support.
              <br />
              <span className="text-[#00ffe7]">error code: 0xC0DE</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
