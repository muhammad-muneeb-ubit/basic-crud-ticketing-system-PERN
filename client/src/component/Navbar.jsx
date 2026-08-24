import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ role }) => {
  const location = useLocation();

  const adminLinks = [
    { name: 'All Tickets', path: '/tickets' },
    { name: 'Manage Users', path: '/users' },
    { name: 'Create Ticket', path: '/tickets/create' },
  ];

  const userLinks = [
    { name: 'My Tickets', path: '/tickets' },
    { name: 'Create Ticket', path: '/tickets/create' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-black text-indigo-600 tracking-tight">SupportHub</span>
            </div>

            {/* Nav Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {links.map((link) => {
                const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
                const isExact = location.pathname === link.path;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`${isExact
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side Profile / Logout */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              {role}
            </span>
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

