import React, { useEffect, useState } from "react";
import { VideoCard } from "../Component/Card";

export const Homepage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);
<H1></H1>
  const fetchVideos = async () => {
    try {
      const res = await fetch(
        "https://697343e3b5f46f8b5826ae3f.mockapi.io/videos"
      );
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos");
    }
  };

  return (
    <div className="home-container">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
