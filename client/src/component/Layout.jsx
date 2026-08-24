import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ role, setUserRole }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={role} setUserRole={setUserRole} />
      {/* The Outlet renders the child routes (e.g., Tickets, Users, etc.) */}
      <Outlet />
    </div>
  );
};

export default Layout;

