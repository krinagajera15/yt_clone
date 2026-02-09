import React, { useEffect, useState, useRef, useContext } from "react";
import { HiMenu } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdMic, MdVideoCall, MdNotifications } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import imgs from '../assets/image/youtube.png'
import Modecontext from "../Context/ModeContext";
import VoiceSearchModal from "./VoiceSearchModal";
import CreateChannelModal from "./CreateChannelModal"; 
import NotificationsModal from "./NotificationsModal";

const Navbar = ({ toggleSidebar }) => {
  const [userInitial, setUserInitial] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [videoDropdownOpen, setVideoDropdownOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const dropdownRef = useRef(null);

  const { mode, toggleMode } = useContext(Modecontext);

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    if (loginData) {
      const firstLetter = loginData.username
        ? loginData.username.charAt(0).toUpperCase()
        : loginData.email
        ? loginData.email.charAt(0).toUpperCase()
        : "U";
        setUserInitial(firstLetter);
        setIsLoggedIn(true);
    }else {
      setUserInitial("U");
      setIsLoggedIn(false);
    }
  }, []);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (videoRef.current && !videoRef.current.contains(event.target)) {
        setVideoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    navigate("/login");
  };

  const handleCreateChannel = (channel) => {
    console.log("New Channel Created:", channel);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <HiMenu className="nav-icon" onClick={toggleSidebar} />
          <img src={imgs} alt="YouTube Logo" className="yt-logo" />
          <h1 className="yt-logo-title">YouTube</h1>
          <span className="country-code">IN</span>
        </div>

        <div className="nav-center">
          <div className="search-box">
            <input type="text" placeholder="Search" />
            <button className="search-btn"><AiOutlineSearch /></button>
          </div>
          <div className="mic-icon" onClick={() => setVoiceOpen(true)}>
            <MdMic />
          </div>
        </div>

        <div className="nav-right">
          {/* Create Video dropdown */}
          <div className="create-video" ref={videoRef}>
            <MdVideoCall
              className="nav-icon"
              onClick={() => setVideoDropdownOpen(!videoDropdownOpen)}
            />
            {videoDropdownOpen && (
              <div className="video-dropdown">
                <button onClick={() => setCreateChannelOpen(true)}>Upload video</button>
                <button onClick={() => alert("Go live clicked")}>Go live</button>
              </div>
            )}
          </div>

          <MdNotifications
            className="nav-icon"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          />

          {/* User Profile */}
          <div className="user-profile-container" ref={dropdownRef} style={{position: 'relative'}}>
            <div className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {userInitial || "U"}
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
              {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <button onClick={() => navigate("/login")}>Login</button>
              )}
                <button onClick={toggleMode}>
                  {mode === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <VoiceSearchModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
      <CreateChannelModal
        isOpen={createChannelOpen}
        onClose={() => setCreateChannelOpen(false)}
        onCreate={handleCreateChannel}
      />
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
};

export default Navbar;