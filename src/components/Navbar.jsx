import React, { useEffect, useState, useRef } from "react";
import { HiMenu } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdMic, MdVideoCall, MdNotifications } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({toggleSidebar}) => {
  const [userInitial, setUserInitial] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch login data from localStorage on mount
  // useEffect(() => {
  //   const loginData = JSON.parse(localStorage.getItem("loginData"));
  //   if (loginData) {
  //     const firstLetter = loginData.username
  //       ? loginData.username.charAt(0).toUpperCase()
  //       : loginData.email.charAt(0).toUpperCase();
  //     setUserInitial(firstLetter);
  //   }
  // }, []);
  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    if (loginData) {
      const firstLetter = loginData.username
        ? loginData.username.charAt(0).toUpperCase()
        : loginData.email
        ? loginData.email.charAt(0).toUpperCase()
        : "U";

      setUserInitial(firstLetter);
    }
  }, []);


  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <HiMenu className="nav-icon" onClick={toggleSidebar} />
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" 
          alt="YouTube Logo" 
          className="yt-logo" 
        />
        <span className="country-code">IN</span>
      </div>
      
      <div className="nav-center">
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <button className="search-btn"><AiOutlineSearch /></button>
        </div>
        <div className="mic-icon"><MdMic /></div>
      </div>

      <div className="nav-right" ref={dropdownRef}>
        <MdVideoCall className="nav-icon" />
        <MdNotifications className="nav-icon" />

        {/* User Profile Circle */}
        <div 
          className="user-profile" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title="Profile options"
        >
          {userInitial || "U"}
        </div>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="profile-dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
