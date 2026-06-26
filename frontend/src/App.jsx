import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Hydration from './pages/Hydration'
import Sleep from './pages/Sleep'
import Nutrition from './pages/Nutrition'
import Fitness from './pages/Fitness'
import Insights from './pages/Insights'
import Chatbot from './pages/Chatbot'
import Profile from './pages/Profile'
import Bmi from './pages/Bmi'
import Symptoms from './pages/Symptoms'
import Reminders from './pages/Reminders'
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Routes>

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/"
    element={
      <ProtectedRoute role="user">
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="hydration" element={<Hydration />} />
    <Route path="sleep" element={<Sleep />} />
    <Route path="nutrition" element={<Nutrition />} />
    <Route path="fitness" element={<Fitness />} />
    <Route path="insights" element={<Insights />} />
    <Route path="chatbot" element={<Chatbot />} />
    <Route path="profile" element={<Profile />} />
    <Route path="bmi" element={<Bmi />} />
    <Route path="symptoms" element={<Symptoms />} />
    <Route path="reminders" element={<Reminders />} />
  </Route>

</Routes>
  )
}

export default App