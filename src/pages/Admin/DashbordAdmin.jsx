import React, { useEffect, useState } from 'react';
import { Users, Tv, Play } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import './DashbordAdmin.css'
import Sidebaradmin from '../../components/Admin/SidebarAdmin';
import Navbaradmin from '../../components/Admin/NavbarAdmin';

const Dashboardadmin = () => {
  const [totalUsers, setTotalUsers] = useState(0);
   const [totalChannels, setTotalChannels] = useState(0);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
     const fetchData = async () => {
       try {
         setLoading(true);
 
         // ✅ UPDATED USERS API
         const userRes = await fetch("https://697343e3b5f46f8b5826ae3f.mockapi.io/users");
         const userData = await userRes.json();
         setTotalUsers(Array.isArray(userData) ? userData.length : 0);
 
         // ✅ CHANNELS API (same as before)
         const channelRes = await fetch("https://69809eaa6570ee87d50fd891.mockapi.io/channelsdata");
         const channelData = await channelRes.json();
         setTotalChannels(Array.isArray(channelData) ? channelData.length : 0);
 
       } catch (error) {
         console.error("API Fetch Error:", error);
         setTotalUsers(0);
         setTotalChannels(0);
       } finally {
         setLoading(false);
       }
     };
 
     fetchData();
   }, []);

  const chartData = [
    { name: '@@KrinaGajera', videos: 520 },
    { name: 'Hetvi Vadaliya', videos: 480 },
    { name: 'friends', videos: 410 },
    { name: 'Prinjal_rupareliya', videos: 350 },
  ];

  return (
    <div className="admin-container">
      <Sidebaradmin />

      <main className="admin-main-content">
        <Navbaradmin />

        <section className="admin-stats-grid">
  {/* Total Users */}
            <div className="admin-stat-card blue">
              <div className="admin-stat-info">
                <p className="admin-stat-label">Total Users</p>
                <h2 className="admin-stat-value">
                  {loading ? "..." : totalUsers.toLocaleString()}
                </h2>
              </div>
              <Users size={40} className="admin-stat-icon-bg" />
            </div>
  
            {/* Total Channels */}
            <div className="admin-stat-card red">
              <div className="admin-stat-info">
                <p className="admin-stat-label">Total Channels</p>
                <h2 className="admin-stat-value">
                  {loading ? "..." : totalChannels.toLocaleString()}
                </h2>
              </div>
              <Tv size={40} className="admin-stat-icon-bg" />
            </div>
  
  <div className="admin-stat-card green">
    <div>
      <p>Total Views</p>
      <h2>9.2 Billion</h2>
    </div>
    <Play size={42} className="stat-icon" />
  </div>
</section>

<section className="admin-chart-section">
  <h3>Highest Video Uploaded Channels</h3>

  <ResponsiveContainer width="100%" height={320}>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="videos" radius={[8, 8, 0, 0]}>
        {chartData.map((_, i) => (
          <Cell key={i} fill={i === 0 ? '#ff0000' : '#444'} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</section>

      </main>
    </div>
  );
};

export default Dashboardadmin;
