// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Navbar = ({ role }) => {
//   const location = useLocation();

//   const adminLinks = [
//     { name: 'All Tickets', path: '/tickets' },
//     { name: 'Manage Users', path: '/users' },
//     { name: 'Create Ticket', path: '/tickets/create' },
//   ];

//   const userLinks = [
//     { name: 'My Tickets', path: '/tickets' },
//     { name: 'Create Ticket', path: '/tickets/create' },
//   ];

//   const links = role === 'admin' ? adminLinks : userLinks;

//   return (
//     <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             {/* Logo */}
//             <div className="flex-shrink-0 flex items-center">
//               <span className="text-xl font-black text-indigo-600 tracking-tight">SupportHub</span>
//             </div>

//             {/* Nav Links */}
//             <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
//               {links.map((link) => {
//                 const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
//                 const isExact = location.pathname === link.path;

//                 return (
//                   <Link
//                     key={link.name}
//                     to={link.path}
//                     className={`${isExact
//                         ? 'border-indigo-500 text-indigo-600'
//                         : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
//                       } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200`}
//                   >
//                     {link.name}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Right side Profile / Logout */}
//           <div className="flex items-center gap-4">
//             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
//               {role}
//             </span>
//             <Link
//               to="/login"
//               className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
//             >
//               Logout
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../public/favicon.png';
const Navbar = ({ role, setUserRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  const handleLogout = () => {
    // Remove logged-in user
    localStorage.removeItem('user');

    // Update React state
    if (setUserRole) {
      setUserRole(null);
    }

    // Close mobile menu
    setIsOpen(false);

    // Redirect to login
    navigate('/login');
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Navbar */}
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/tickets"
              onClick={handleLinkClick}
              className="text-xl font-black text-indigo-600 tracking-tight"
            >
              {/* SupportHub */}
              <img src={logo} alt="SupportHub Logo" className="h-8 w-8 mr-2 inline-block" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isExact = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    isExact
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  } inline-flex items-center h-16 border-b-2 text-sm font-semibold transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Profile / Logout */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              {role}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 py-3">

            {/* Mobile Links */}
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const isExact = location.pathname === link.path;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`${
                      isExact
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    } px-4 py-3 rounded-lg text-sm font-semibold transition-colors`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Role + Logout */}
            <div className="border-t border-slate-200 mt-3 pt-3 px-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                {role}
              </span>

              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;