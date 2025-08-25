import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Crops } from "./pages/Crops"
import { Tasks } from "./pages/Tasks"
import { Activities } from "./pages/Activities"
import { MonthlyRecommendations } from "./pages/MonthlyRecommendations"
import { Profile } from "./pages/Profile"
import { Feedback } from "./pages/Feedback"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="crops" element={<Crops />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="activities" element={<Activities />} />
              <Route path="recommendations" element={<MonthlyRecommendations />} />
              <Route path="profile" element={<Profile />} />
              <Route path="feedback" element={<Feedback />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App