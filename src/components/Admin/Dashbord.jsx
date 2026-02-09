import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Users, Tv, Play, Bell, UserCircle, LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import './Dashbord.css';

const Dashboard = () => {
  // State for Users and Channels
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalChannels, setTotalChannels] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetching data from both APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users
        const userRes = await fetch("https://67a3299731d81371f249fe0d.mockapi.io/users");
        const userData = await userRes.json();
        setTotalUsers(userData.length);

        // Fetch Channels
        const channelRes = await fetch("https://67a3299731d81371f249fe0d.mockapi.io/channelsdata");
        const channelData = await channelRes.json();
        setTotalChannels(channelData.length);

      } catch (error) {
        console.error("API Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Static chart data (You can also fetch this later)
  const chartData = [
    { name: 'T-Series', videos: 520 },
    { name: 'Set India', videos: 480 },
    { name: 'MrBeast', videos: 410 },
    { name: 'PewDiePie', videos: 350 },
    { name: 'Goldmines', videos: 300 },
  ];

  return (
    <div className="admin-container">
      {/* --- SIDEBAR --- */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-icon">▶</div>
          <span className="admin-logo-text">Admin YouTube</span>
        </div>
        <nav className="admin-sidebar-menu">
          <div className="admin-menu-item active"><LayoutDashboard size={20} /> Dashboard</div>
          <div className="admin-menu-item"><Tv size={20} /> Total Channels</div>
          <div className="admin-menu-item"><Play size={20} /> Manage Videos</div>
          <div className="admin-menu-item"><Users size={20} /> Users List</div>
          <div className="admin-menu-item"><BarChart3 size={20} /> Analytics</div>
          <div className="admin-menu-item"><Settings size={20} /> Settings</div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="admin-main-content">
        <header className="admin-navbar">
          <div className="admin-nav-title">Dashboard Overview</div>
          <div className="admin-nav-actions">
            <Bell className="admin-nav-icon" size={22} />
            <div className="admin-profile-section">
              <span>Admin Raj</span>
              <UserCircle size={35} color="#666" />
            </div>
          </div>
        </header>

        {/* --- STATS CARDS --- */}
        <section className="admin-stats-grid">
          {/* Card 1: Total Users */}
          <div className="admin-stat-card blue">
            <div className="admin-stat-info">
              <p className="admin-stat-label">Total Users</p>
              <h2 className="admin-stat-value">
                {loading ? "..." : totalUsers.toLocaleString()}
              </h2>
            </div>
            <Users size={40} className="admin-stat-icon-bg" />
          </div>

          {/* Card 2: Total Channels */}
          <div className="admin-stat-card red">
            <div className="admin-stat-info">
              <p className="admin-stat-label">Total Channels</p>
              <h2 className="admin-stat-value">
                {loading ? "..." : totalChannels.toLocaleString()}
              </h2>
            </div>
            <Tv size={40} className="admin-stat-icon-bg" />
          </div>

          {/* Card 3: Total Views (Static for now) */}
          <div className="admin-stat-card green">
            <div className="admin-stat-info">
              <p className="admin-stat-label">Total Views</p>
              <h2 className="admin-stat-value">9.2 Billion</h2>
            </div>
            <Play size={40} className="admin-stat-icon-bg" />
          </div>
        </section>

        {/* --- CHART SECTION --- */}
        <section className="admin-chart-section">
          <h3 className="admin-section-title">Highest Video Uploaded Channels</h3>
          <div className="admin-chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f9f9f9' }} />
                <Bar dataKey="videos" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ff0000' : '#444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;