import React, { useState, useEffect, useRef, useContext } from 'react';
import './Userdetails.css';
import Modecontext from '../../Context/ModeContext';
import { useNavigate } from 'react-router-dom';
import CreateChannelModal from '../CreateChannelModal';

const UserDetails = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownListOpen, setIsDropdownListOpen] = useState(false);
  const [videos, setVideos] = useState([]); // આમાં API અને LocalStorage બંનેનો ડેટા રહેશે
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");

  const [channelInfo, setChannelInfo] = useState({ name: "", email: "", image: null });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { mode, toggleMode } = useContext(Modecontext);

  const API_URL = "https://697343e3b5f46f8b5826ae3f.mockapi.io/videos";

  const loadChannelData = () => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const allChannels = JSON.parse(localStorage.getItem("userChannels")) || {};

    if (loginData && loginData.email) {
      const userEmail = loginData.email;
      const userChannel = allChannels[userEmail];

      if (userChannel) {
        const currentName = userChannel.c_name;
        setChannelInfo({
          name: currentName,
          email: userEmail,
          image: userChannel.c_image
        });

        // ડેટા ફેચ કરવાનું ફંક્શન કોલ કરો
        fetchAndCombineContent(currentName, userEmail);
      } else {
        setLoading(false);
      }
    }
  };

  // --- API અને LocalStorage માંથી ડેટા ભેગો કરવાનું ફંક્શન ---
  const fetchAndCombineContent = async (currentChannelName, userEmail) => {
    try {
      setLoading(true);

      // 1. MockAPI માંથી વિડીયો લાવો
      const response = await fetch(API_URL);
      let apiData = [];
      if (response.ok) {
        apiData = await response.json();
      }

      // 2. LocalStorage માંથી શોર્ટ્સ લાવો
      const localShorts = JSON.parse(localStorage.getItem("shorts")) || [];

      // 3. બંનેને ફિલ્ટર કરો (ફક્ત આ ચેનલના જ ડેટા)
      const filteredApiVideos = apiData.filter(item => item.channel === currentChannelName);
      const filteredLocalShorts = localShorts.filter(item => item.userEmail === userEmail || item.channel === currentChannelName);

      // 4. બંને ડેટાને એક જ સ્ટેટમાં ભેગા કરો
      setVideos([...filteredApiVideos, ...filteredLocalShorts]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannelData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsDropdownListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ટેબ મુજબ ડેટા ફિલ્ટર કરવો
  const filteredData = videos.filter(item => {
    if (activeTab === "Videos") return item.type !== "shorts";
    if (activeTab === "Shorts") return item.type === "shorts";
    return true;
  });

  // --- ડિલીટ કરવાનું લોજિક ---
  const handleDelete = async (id, itemType) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab}?`)) {
      if (itemType === "shorts") {
        // LocalStorage માંથી ડિલીટ કરો
        const localShorts = JSON.parse(localStorage.getItem("shorts")) || [];
        const updatedShorts = localShorts.filter(s => s.id !== id);
        localStorage.setItem("shorts", JSON.stringify(updatedShorts));
        
        // સ્ટેટ અપડેટ કરો
        setVideos(prev => prev.filter(v => v.id !== id));
        alert("Short deleted successfully!");
      } else {
        // MockAPI માંથી ડિલીટ કરો
        try {
          const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (response.ok) {
            setVideos(prev => prev.filter(video => video.id !== id));
            alert("Video deleted successfully!");
          }
        } catch (error) {
          console.error("Error deleting video:", error);
        }
      }
    }
  };

  return (
    <div className={`userdetl-studio-container ${mode === 'dark' ? 'dark-theme' : ''}`}>
      <aside className="userdetl-sidebar">
        <div className="userdetl-profile-section">
          <div className="userdetl-profile-circle">
            {channelInfo.image ? (
              <img src={channelInfo.image} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              channelInfo.name ? channelInfo.name.charAt(0).toUpperCase() : "U"
            )}
          </div>
          <h3>Your channel</h3>
          <p>{channelInfo.name || "No Channel Found"}</p>
        </div>
        <nav className="userdetl-nav-menu">
          <div className="userdetl-nav-item active"><i className="icon">🎬</i> Content</div>
          <div className="userdetl-nav-item"><i className="icon">📊</i> Dashboard</div>
          <div className="userdetl-nav-item"><i className="icon">📈</i> Analytics</div>
          <div className="userdetl-nav-item"><i className="icon">💬</i> Community</div>
          <div className="userdetl-nav-item"><i className="icon">⚙️</i> Settings</div>
        </nav>
      </aside>

      <main className="userdetl-main-content">
        <header className="userdetl-top-navbar">
          <div className="userdetl-earch-bar">
            <input type="text" placeholder="Search across your channel" />
          </div>
          <div className="userdetl-top-actions">
            <div className='userdetl-chen-pro-class' ref={dropdownRef}>
              <button className="userdetl-create-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <i className="icon">🎥</i> Create
              </button>

              {isDropdownOpen && (
                <div className="userdetl-dropdown-menu">
                  <div className="userdetl-dropdown-item" onClick={() => navigate('/admin/add-video')}>
                    <i className="icon">📤</i> Upload Video
                  </div>
                  <div className="userdetl-dropdown-item" onClick={() => navigate('/addshorts')}>
                    <i className="icon">📱</i> Add Shorts
                  </div>
                  <div className="userdetl-dropdown-item theme-toggle-item" onClick={toggleMode}>
                    <i className="icon">{mode === "light" ? "🌙" : "☀️"}</i>
                    <span>Theme</span>
                  </div>
                </div>
              )}

              <div className="userdetl-user-icon" onClick={() => setIsDropdownListOpen(!isDropdownListOpen)} style={{ cursor: 'pointer' }}>
                {channelInfo.name ? channelInfo.name.charAt(0).toUpperCase() : "K"}
              </div>
              {isDropdownListOpen && (
                <div className="userdetl-dropdown-menu profile-dropdown">
                  <div className="userdetl-dropdown-item" onClick={() => { setIsModalOpen(true); setIsDropdownListOpen(false); }}>
                    <i className="icon">✏️</i> Edit Profile
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="userdetl-tabs-container">
          <ul className="userdetl-tabs">
            <li className={activeTab === "Videos" ? "userdetl-active" : ""} onClick={() => setActiveTab("Videos")}>Videos</li>
            <li className={activeTab === "Shorts" ? "userdetl-active" : ""} onClick={() => setActiveTab("Shorts")}>Shorts</li>
            <li className={activeTab === "Live" ? "userdetl-active" : ""} onClick={() => setActiveTab("Live")}>Live</li>
          </ul>
        </div>

        <div className="userdetl-content-body">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading {activeTab}...</p>
          ) : filteredData.length > 0 ? (
            <table className="userdetl-video-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>{activeTab} Title</th>
                  <th>Views</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img 
                        src={item.type === 'shorts' ? `https://img.youtube.com/vi/${item.videoId}/0.jpg` : item.thumbnail} 
                        alt="thumb" 
                        style={{ width: '70px', height: item.type === 'shorts' ? '90px' : '50px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    </td>
                    <td style={{ fontWeight: '500' }}>{item.title}</td>
                    <td>{item.views || 0}</td>
                    <td>
                      <button className="delete-icon" onClick={() => handleDelete(item.id, item.type)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="userdetl-no-content">
              <p>No {activeTab} found for <b>{channelInfo.name}</b>.</p>
              <button className="userdetl-upload-btn" onClick={() => navigate(activeTab === "Shorts" ? '/addshorts' : '/admin/add-video')}>
                Upload {activeTab}
              </button>
            </div>
          )}
        </div>
      </main>

      <CreateChannelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadChannelData();
        }}
      />
    </div>
  );
};

export default UserDetails;