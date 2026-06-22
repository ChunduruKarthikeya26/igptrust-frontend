import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import { WebsiteProvider } from "./context/WebsiteContext"
import { TooltipProvider } from "./components/ui/tooltip"
import ProtectedRoute from "./components/ProtectedRoute"
import Team from "./pages/Team"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Websites from "./pages/Websites"
import WebsiteDetail from "./pages/WebsiteDetail"
import ConsentLogs from "./pages/ConsentLogs"
import CookieManager from "./pages/CookieManager"
import AuditLogs from "./pages/AuditLogs"
import Settings from "./pages/Settings"
import Scanner from "./pages/Scanner"
import RenewalPage from "./pages/RenewalPage"
import Grievances from "./pages/Grievances"
import Notifications from "./pages/Notifications"
import DataRetention from "./pages/DataRetention"
import Analytics from "./pages/Analytics"
import PortalLogin from "./pages/portal/PortalLogin"
import PortalDashboard from "./pages/portal/PortalDashboard"
import PortalGrievance from "./pages/portal/PortalGrievance"
import FeedbackPage from "./pages/FeedbackPage"
import GrievanceTrack from "./pages/GrievanceTrack"
import DialogVersions from "./pages/DialogVersions"
import DataRightsInbox from "./pages/DataRightsInbox"
import PortalRights from "./pages/portal/PortalRights"
import PendingApprovals from './pages/PendingApprovals'
import ConsentValidation from './pages/ConsentValidation'
import ReconsentPage from "./pages/ReconsentPage"
import LandingPage from "./components/LandingPage"
import MainLanding from "./components/MainLanding"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebsiteProvider>
          <TooltipProvider>
            <Toaster position="top-right" toastOptions={{ style: { fontSize: "13px" } }} />
            <Routes>
              <Route path="/main" element={<MainLanding />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/websites" element={<Websites />} />
              <Route path="/websites/:id" element={<WebsiteDetail />} />
              <Route path="/websites/:id/consents" element={<ConsentLogs />} />
              <Route path="/websites/:id/cookies" element={<CookieManager />} />
              <Route path="/cookies" element={<CookieManager />} />
              <Route path="/audit" element={<AuditLogs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/consents" element={<ConsentLogs />} />
              <Route path="/renewal" element={<RenewalPage />} />
              <Route path="/grievances" element={<Grievances />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/retention" element={<DataRetention />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/dialog-versions" element={<DialogVersions />} />
              <Route path="/rights" element={<DataRightsInbox />} />
              <Route path="/team" element={<Team />} />
              <Route path="/approvals" element={<PendingApprovals />} />
              <Route path="/consent-validation" element={<ConsentValidation />} />
            </Route>

            {/* Portal — public, no auth required */}
            <Route path="/portal" element={<PortalLogin />} />
            <Route path="/portal/dashboard" element={<PortalDashboard />} />
            <Route path="/portal/grievance" element={<PortalGrievance />} />
            <Route path="/feedback/:grievanceId" element={<FeedbackPage />} />
            <Route path="/grievance/track" element={<GrievanceTrack />} />
            <Route path="/portal/rights" element={<PortalRights />} />

            {/* Re-consent — public, opened from email link */}
            <Route path="/reconsent/:token" element={<ReconsentPage />} />

            {/* Fallback — must be last */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </TooltipProvider>
      </WebsiteProvider>
    </AuthProvider>
  </BrowserRouter>
  )
}