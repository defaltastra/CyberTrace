import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60dvh] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="text-lg font-semibold text-text">Une erreur est survenue</div>
          <p className="max-w-md text-sm font-mono text-text-muted">
            L’interface n’a pas pu s’afficher correctement. Rechargez l’application pour
            reprendre la surveillance.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded border border-accent bg-accent/10 text-sm font-mono text-accent hover:bg-accent/20 transition-colors"
          >
            Recharger l’application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
