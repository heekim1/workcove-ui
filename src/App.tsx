import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { AppShell } from './components/AppShell'
import { JobDetailPage } from './pages/JobDetailPage'
import { JobsPage } from './pages/JobsPage'
import { LoginPage } from './pages/LoginPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { RegisterPage } from './pages/RegisterPage'
import { TermsPage } from './pages/TermsPage'
import { VerifyPage } from './pages/VerifyPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:jobId"
              element={
                <ProtectedRoute>
                  <JobDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AuthProvider>
  )
}
