import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; label?: string }
type State = { error: Error | null }

/** Keeps the shell alive when a route throws; surfaces the message for preprod debugging. */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[EU4Y ${this.props.label || 'route'}]`, error, info.componentStack)
  }

  componentDidUpdate(prev: Props) {
    if (prev.children !== this.props.children && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="page" style={{ padding: '4rem 2rem', maxWidth: '40rem' }}>
        <h1 style={{ color: 'var(--eu-blue, #074ea2)' }}>Cette page a rencontré une erreur</h1>
        <p style={{ color: '#444' }}>
          {this.props.label ? `Zone : ${this.props.label}. ` : null}
          Rechargez la page. Si le problème continue, signalez-le à l’équipe.
        </p>
        <pre
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f4f4f4',
            overflow: 'auto',
            fontSize: '0.85rem',
          }}
        >
          {this.state.error.message}
        </pre>
        <button type="button" className="btn" onClick={() => this.setState({ error: null })}>
          Réessayer
        </button>
      </div>
    )
  }
}
