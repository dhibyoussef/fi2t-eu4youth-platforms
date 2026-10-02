import { Navigate } from 'react-router-dom'

/** Cookies & legal texts are edited in Paramètres du site — this route redirects editors there. */
export default function LegalPage() {
  return <Navigate to="/pages?page=global&tab=cookies" replace />
}
