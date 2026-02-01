// Layout.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { MiniSidebar } from "../components/SubSidebar";
import Sidebar from "../components/Sidebar";

export const SubMainSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />

      {isSidebarOpen ? <Sidebar /> : <MiniSidebar />}
    </>
  );
};
