import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Tickets from './pages/Tickets'
import Users from './pages/Users'
import CreateTickets from './pages/CreateTickets'
import TicketsDetails from './pages/TicketsDetails'
import Layout from './component/Layout'
import { useState } from 'react'

function App() {
  const [userRole, setUserRole] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return null;
    }
    const user = JSON.parse(storedUser);
    return user.data?.role || "user";

  });

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes without Navbar */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Navbar */}
        <Route element={<Layout role={userRole} setUserRole={setUserRole} />}>
          <Route path="/tickets" element={<Tickets role={userRole} />} />
          <Route path="/tickets/create" element={<CreateTickets />} />
          <Route path="/tickets/:id" element={<TicketsDetails role={userRole} />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
