import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MiniSidebar from "../components/SubSidebar";
import { Outlet } from "react-router-dom";
import Modecontext from "../Context/ModeContext"; // Context ઈમ્પોર્ટ કરો

export const AuthGuard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // થીમ મેળવો
  const ctx = useContext(Modecontext);
  const theme = ctx?.mode || 'light';

  // થીમ મુજબ કલર નક્કી કરો
  const bgColor = theme === "dark" ? "#0f0f0f" : "#ffffff";
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <>
      {/* મુખ્ય કન્ટેનર - કલર હવે વેરિએબલ (bgColor) થી આવશે */}
      <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor }}>
        
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* 🔽 BODY */}
        <div style={{ display: "flex" }}>
          {isSidebarOpen ? <Sidebar /> : <MiniSidebar />}

          {/* કન્ટેન્ટ એરિયા - અહીંથી પણ ફિક્સ કલર કાઢી નાખ્યો */}
          <div style={{ flex: 1, padding: "20px" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};