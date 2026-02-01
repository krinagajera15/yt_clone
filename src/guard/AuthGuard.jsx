import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { MiniSidebar } from "../components/SubSidebar";
import { Outlet } from "react-router-dom";

export const AuthGuard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      {/* 🔝 TOP NAVBAR – ONLY ONCE */}
      <div style={{ backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* 🔽 BODY */}
      <div style={{ display: "flex" }}>
        {isSidebarOpen ? <Sidebar /> : <MiniSidebar />}

        <div style={{ flex: 1, padding: "20px", backgroundColor: "#0f0f0f" }}>
          <Outlet />
        </div>
      </div>
      </div>
    </>
  );
};

// import React from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { SubMainSidebar } from "../pages/Sidebar";

// const AuthGuard = () => {
//   return (
//     <div style={{ backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
//       <Navbar />
//       <div style={{ display: "flex" }}>
//         <SubMainSidebar />
//         {/* Main Content Area */}
//         <div style={{ flex: 1, padding: "20px", backgroundColor: "#0f0f0f" }}>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AuthGuard;