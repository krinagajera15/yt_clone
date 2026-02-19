import React, { useEffect, useRef, useState } from 'react';
import { Bell, LogOut, UserCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavbarAdmin.css';

const Navbaradmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Dynamic admin name
  const adminName = localStorage.getItem('adminName') || 'Admin';

    // 🔹 Dropdown state
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

    // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
       document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Page name mapping
  const pageTitles = {
    '/dashbordadmin': 'Dashboard Overview',
    '/userdata': 'Users List',
    '/chanelpage': 'Channels List',
    '/manageadminvideo': 'Manage Videos',
    '/admin/analytics': 'Analytics',
    '/admin/settings': 'Settings',
  };

  const currentTitle =
    pageTitles[location.pathname] || 'Dashboard';

      const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="admin-navbar">
      <div className="admin-nav-title">{currentTitle}</div>

      <div className="admin-nav-actions">
        <Bell size={22} />
         <div className="admin-profile-section" ref={dropdownRef}>
          <div
            className="profile-trigger"
            onClick={() => setOpen(!open)}
          >
            <span>{adminName}</span>
            <UserCircle size={35} />
          </div>

          {open && (
            <div className="profile-dropdown">
              <button onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbaradmin;
