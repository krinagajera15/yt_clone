import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoCard.css";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video.id}`);
  };

  const formatDuration = (duration) => {
    if (!duration) return "00:00";
    if (typeof duration === "string" && duration.includes(":")) return duration;

    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 🔒 UNIQUE KEY per video
  const viewsKey = `video_views_${video.id}`;
  const daysKey = `video_days_${video.id}`;

  // 🔹 Views (generate once, store forever)
  let views = localStorage.getItem(viewsKey);
  if (!views) {
    const v = Math.floor(Math.random() * 900000) + 1000000;
    views =
      v >= 1000000
        ? (v / 1000000).toFixed(1) + "M views"
        : (v / 1000).toFixed(1) + "K views";
    localStorage.setItem(viewsKey, views);
  }

  // 🔹 Days ago (generate once, store forever)
  let daysAgo = localStorage.getItem(daysKey);
  if (!daysAgo) {
    const d = Math.floor(Math.random() * 30) + 1;
    daysAgo = `${d} days ago`;
    localStorage.setItem(daysKey, daysAgo);
  }

  return (
    <div className="video-card" onClick={handleClick}>
      <div className="thumbnail-wrapper">
        <img src={video.thumbnail} alt={video.title} />
        <span className="duration">
          {video.duration ? formatDuration(video.duration) : "00:00"}
        </span>
      </div>

      <div className="video-info">
        <div className="title-row">
          {video.channelImage && (
            <img
              src={video.channelImage}
              alt={video.channel}
              className="channel-avatar"
            />
          )}

          <div className="text-info">
            {/* 🔹 Title */}
            <h2 className="video-title">{video.title}</h2>

            {/* 🔹 Channel name */}
            <p className="video-channel">{video.channel}</p>

            {/* 🔹 Views & days */}
            <p className="video-meta">
              {views} • {daysAgo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;