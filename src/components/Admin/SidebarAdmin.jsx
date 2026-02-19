import React from 'react';
import { Users, Tv, Play, LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import './SidebarAdmin.css';
import { NavLink } from 'react-router-dom';

const Sidebaradmin = () => {
 
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo-icon">▶</div>
        <span className="admin-logo-text">Admin YouTube</span>
      </div>

      <nav className="admin-sidebar-menu">
        <div className="admin-menu-item active">
          <NavLink to={"/dashbordadmin"} ><LayoutDashboard size={20} color='white' /> Dashboard</NavLink>
        </div>
        <div className="admin-menu-item">
           <NavLink to={"/chanelpage"} ><Tv size={20} color='white' /> Total Channels</NavLink>
        </div>
        <div className="admin-menu-item">
          <NavLink to={"/manageadminvideo"}><Play size={20} color='white'/> Manage Videos</NavLink>
        </div>
        <div className="admin-menu-item">
          <NavLink to={"/userdata"}><Users size={20} color='white'/> Users List</NavLink>
        </div>
        <div className="admin-menu-item">
          <BarChart3 size={20} color='white'/> Analytics
        </div>
        <div className="admin-menu-item">
          <Settings size={20} color='white'/> Settings
        </div>
      </nav>
    </aside>
  );
};

export default Sidebaradmin;
