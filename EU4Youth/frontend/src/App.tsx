import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { AppLayout } from './components/layout/AppLayout'
import PermissionGuard from './components/PermissionGuard'

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const LiveEditorPage = lazy(() => import('./pages/live/LiveEditorPage'))
const WebsiteContentPage = lazy(() => import('./pages/content/WebsiteContentPage'))
const ProjectsPage = lazy(() => import('./pages/content/ProjectsPage'))
const CollectionStudio = lazy(() => import('./pages/content/CollectionStudio'))
const GlossaryAdminPage = lazy(() => import('./pages/content/GlossaryAdminPage'))
const LegalPage = lazy(() => import('./pages/content/LegalPage'))
const InboxPage = lazy(() => import('./pages/content/InboxPage'))
const UsersPage = lazy(() => import('./pages/users/UsersPage'))
const RolesPage = lazy(() => import('./pages/users/RolesPage'))
const TranslationsPage = lazy(() => import('./pages/translations/TranslationsPage'))
const ActivityLogPage = lazy(() => import('./pages/admin/ActivityLogPage'))
const ValidationQueuePage = lazy(() => import('./pages/admin/ValidationQueuePage'))

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 20_000 } } })

function Guard({ guest = false }: { guest?: boolean }) {
  const { token, ready } = useAuth()
  if (!ready) return <Loader />
  if (guest) return token ? <Navigate to="/dashboard" replace /> : <Outlet />
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

function Loader() {
  return (
    <div className="app-loader">
      <span className="app-loader__spin" aria-hidden="true" />
      <p>Chargement du back-office…</p>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter basename={(import.meta.env.BASE_URL || '/').replace(/\/$/, '') || undefined}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route element={<Guard guest />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>
              <Route element={<Guard />}>
                <Route element={<PermissionGuard />}>
                  <Route element={<AppLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/live-editor" element={<LiveEditorPage />} />
                  <Route path="/pages" element={<WebsiteContentPage />} />
                  <Route path="/website-content" element={<Navigate to="/pages" replace />} />
                  <Route path="/projets" element={<ProjectsPage />} />
                  <Route path="/actualites" element={<CollectionStudio kind="news" />} />
                  <Route path="/publications" element={<CollectionStudio kind="publications" />} />
                  <Route path="/agenda" element={<CollectionStudio kind="events" />} />
                  <Route path="/initiatives" element={<CollectionStudio kind="initiatives" />} />
                  <Route path="/stories" element={<CollectionStudio kind="stories" />} />
                  <Route path="/videos" element={<CollectionStudio kind="videos" />} />
                  <Route path="/opportunites" element={<CollectionStudio kind="opportunities" />} />
                  <Route path="/glossaire" element={<GlossaryAdminPage />} />
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/inbox" element={<InboxPage />} />
                  <Route path="/traductions" element={<TranslationsPage />} />
                  <Route path="/equipe" element={<UsersPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/activite" element={<ActivityLogPage />} />
                  <Route path="/validation" element={<ValidationQueuePage />} />
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
