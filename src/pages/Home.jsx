import React, { useContext, useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import "./Home.css";
import Modecontext from "../Context/ModeContext";

const Home = () => {
  const [videos, setVideos] = useState([]);
  
  // થીમ મેળવવા માટે Context નો ઉપયોગ કરો
  const ctx = useContext(Modecontext);
  const theme = ctx?.mode || 'light'; // default 'light'

  // આખા પેજની થીમ બદલવા માટે useEffect
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const loggedInUserData = JSON.parse(localStorage.getItem("loginData")) || {};

  useEffect(() => {
    fetch("https://697343e3b5f46f8b5826ae3f.mockapi.io/videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
      })
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const handleEdit = (id) => alert("Edit video id: " + id);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    fetch(`https://697343e3b5f46f8b5826ae3f.mockapi.io/videos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setVideos((prev) => prev.filter((v) => v.id !== id));
    });
  };

  return (
    <div className={`home ${theme}`}>
      <h2>Latest Videos</h2>
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isAdmin={loggedInUserData?.role === "admin"}
            onEdit={() => handleEdit(video.id)}
            onDelete={() => handleDelete(video.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;