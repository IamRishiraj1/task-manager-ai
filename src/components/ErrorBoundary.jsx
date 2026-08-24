import React from "react";

// Catches any error thrown while rendering the app and shows a readable
// message instead of a silent blank page. Without this, an uncaught error
// on first render (e.g. a browser API missing on an older phone browser)
// makes React unmount everything with no visible feedback — which is
// exactly the "blank page on mobile" symptom this fixes. This also makes
// future bugs on unusual devices/browsers self-diagnosing: the error
// message and stack shown here is the thing to screenshot and share.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Still log to the console for anyone who can access devtools.
    console.error("Task Manager AI crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>
            The app hit an error while starting up. Screenshot this message (including the text below) so it can be
            fixed.
          </p>
          <pre>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
