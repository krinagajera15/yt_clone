import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./AddVideo.css";
import Modecontext from "../Context/ModeContext";

const AddVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    channel: "",
    channelImage: "",
    thumbnail: "",
    url: "",
    duration: ""
  });

  const navigate = useNavigate();
  const ctx = useContext(Modecontext);
  const theme = ctx?.mode || 'light';

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const userEmail = loginData?.email;

    if (userEmail) {
      const allChannels = JSON.parse(localStorage.getItem("userChannels")) || {};
      const myChannel = allChannels[userEmail];

      if (myChannel) {
        // જો ચેનલ મળે તો ડેટા સેટ કરો
        setFormData((prev) => ({
          ...prev,
          channel: myChannel.c_name,
          channelImage: myChannel.c_image
        }));
      } else {
        // જો ચેનલ નથી બનાવી તો પાછા મોકલો
        alert("You need to create a channel first!");
        navigate("/"); 
      }
    } else {
      alert("Please login to access this page");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "url") {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = value.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;

      if (videoId) {
        setFormData({
          ...formData,
          url: `https://www.youtube.com/embed/${videoId}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        });
      } else {
        setFormData({ ...formData, url: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://697343e3b5f46f8b5826ae3f.mockapi.io/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    .then(() => {
      alert("Video Added Successfully! 🎉");
      navigate("/"); 
    })
    .catch((err) => console.error("Error:", err));
  };

  return (
    <div className={`add-video-container ${theme}`}>
      <div className="add-video-card">
        <h2>Add Video</h2>
        
        {/* ચેનલ પ્રિવ્યૂ */}
        <div className="channel-badge" style={{display: 'flex', alignItems: 'center', gap: '10px', background: '#eee', padding: '10px', borderRadius: '8px', marginBottom: '15px'}}>
          {formData.channelImage && (
            <img 
              src={formData.channelImage} 
              alt="logo" 
              style={{width: '35px', height: '35px', borderRadius: '50%'}} 
            />
          )}
            <span style={{color: '#333', fontWeight: 'bold'}}>
              {formData.channel}
            </span>
        </div>

        <form onSubmit={handleSubmit} className="add-video-form">
          <input name="title" placeholder="Video Title" value={formData.title} onChange={handleChange} required />
          <input name="url" placeholder="YouTube URL" value={formData.url} onChange={handleChange} required />
          <input name="duration" placeholder="Duration (e.g. 5:20)" value={formData.duration} onChange={handleChange} required />
          <div style={{ display: 'flex', gap: '20px' }}>
             {formData.thumbnail && (
                <div className="thumbnail-preview">
                  <p>Video Thumbnail:</p>
                  <img src={formData.thumbnail} alt="Preview" style={{ width: '150px' }} />
                </div>
              )}
          </div>

          <button type="submit" className="upload-btn">UPLOAD</button>
        </form>
      </div>
    </div>
  );
};

export default AddVideo;