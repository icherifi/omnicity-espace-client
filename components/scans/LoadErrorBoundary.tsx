"use client";

import React from "react";

/**
 * Suspense only catches pending promises, not the error a rejected one turns
 * into on the next render - that needs a real error boundary (must be a class
 * component, React has no hook equivalent). Renders nothing on error rather than
 * crashing the whole scene, and reports out via onError so a caller tracking
 * "is everything settled yet" (e.g. the headless render page) counts a failed
 * load as settled too, instead of waiting on it forever.
 */
export class LoadErrorBoundary extends React.Component<
  { onError: (error: unknown) => void; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { onError: (error: unknown) => void; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
