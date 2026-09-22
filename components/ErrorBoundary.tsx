"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="card flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
              <p className="mt-1 mb-4 text-sm text-gray-600">{this.state.error?.message}</p>
              <button type="button" onClick={this.reset} className="btn-primary">
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
