import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import "./AddVideo.css";
import Modecontext from "../Context/ModeContext"; // Context ઈમ્પોર્ટ કરો

const AddVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    channel: "",
    thumbnail: "",
    url: "",
    duration: ""
  });

  const navigate = useNavigate();
  
  // થીમ મેળવો
  const ctx = useContext(Modecontext);
  const theme = ctx?.mode || 'light';

  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "url") {
      const videoId = getYouTubeID(value);
      if (videoId) {
        setFormData({
          ...formData,
          url: `https://www.youtube.com/embed/${videoId}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        });
      } else {
        setFormData({ ...formData, [name]: value });
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
    .then((res) => res.json())
    .then(() => {
      alert("Video Added Successfully! 🎉");
      setFormData({ title: "", channel: "", thumbnail: "", url: "", duration: "" }); 
      navigate("/"); 
    })
    .catch((err) => console.error("Error adding video:", err));
  };

  return (
    // ક્લાસમાં થીમ ઉમેરવી જરૂરી છે
    <div className={`add-video-container ${theme}`}>
      <div className="add-video-card">
        <h2>Add New YouTube Video</h2>
        <form onSubmit={handleSubmit} className="add-video-form">
          
          <div className="input-group">
            <label>Video Title</label>
            <input 
              name="title" 
              placeholder="Enter video title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Channel Name</label>
            <input 
              name="channel" 
              placeholder="Enter channel name" 
              value={formData.channel} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>YouTube URL</label>
            <input 
              name="url" 
              placeholder="Paste YouTube link here" 
              value={formData.url} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Video Duration (e.g. 10:05)</label>
            <input 
              name="duration" 
              placeholder="Enter duration" 
              value={formData.duration} 
              onChange={handleChange} 
              required 
            />
          </div>

          {formData.thumbnail && (
            <div className="thumbnail-preview">
               <p>Thumbnail Preview:</p>
               <img src={formData.thumbnail} alt="Preview" />
            </div>
          )}

          <button type="submit" className="upload-btn">
            UPLOAD VIDEO
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVideo;