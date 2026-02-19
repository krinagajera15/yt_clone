import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "./Watch.css";
import {
  MdThumbUpOffAlt,
  MdThumbDownOffAlt,
  MdShare,
  MdPlaylistAdd,
  MdDownload,
} from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const Watch = () => {
  const { id } = useParams();
  const location = useLocation();

  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // ================= FETCH VIDEO =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resVideo = await fetch(
          `https://697343e3b5f46f8b5826ae3f.mockapi.io/videos/${id}`
        );
        if (!resVideo.ok) throw new Error("Video not found");

        const videoData = await resVideo.json();
        setVideo(videoData);

        const resAll = await fetch(
          "https://697343e3b5f46f8b5826ae3f.mockapi.io/videos"
        );
        const allData = await resAll.json();
        setVideos(allData.filter((v) => v.id !== id));

        setError("");
      } catch {
        setError("Video loading error 😕");
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, location.search]);

  // ================= YOUTUBE ID EXTRACT =================
  const getYouTubeID = (url) => {
    if (!url) return null;

    if (url.includes("embed/")) {
      return url.split("embed/")[1].split("?")[0];
    }

    if (url.includes("watch?v=")) {
      return url.split("watch?v=")[1].split("&")[0];
    }

    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }

    return null;
  };

  // ================= DOWNLOAD FUNCTION =================
  const handleDownload = async () => {
    const videoId = getYouTubeID(video.url);

    if (!videoId) {
      alert("YouTube Video ID not found!");
      return;
    }

    const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      await navigator.clipboard.writeText(ytUrl);

      setShowMenu(false);

      // ✅ FIRST ALERT
      alert("Video link copied ✅\nPress OK to continue to download page");

      // ✅ THEN REDIRECT
      window.open("https://vidssave.com/yt/", "_blank");

    } catch {
      alert("Clipboard permission denied!");
    }
  };

  // ================= UI STATES =================
  if (error) return <div className="watch-page error-text">{error}</div>;
  if (!video) return <div className="watch-page loading-text">Loading...</div>;

  return (
    <div className="watch-container">
      {/* MAIN VIDEO */}
      <div className="watch-main">
        <div className="video-container">
          <iframe
            src={video.url}
            title={video.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        {/* DETAILS */}
        <div className="video-details">
          <h1 className="watch-title">{video.title}</h1>

          <div className="video-actions-row">
            {/* CHANNEL */}
            <div className="channel-info">
              <img
                src={video.channelImage || "https://via.placeholder.com/40"}
                className="channel-avatar-img"
                alt="channel"
              />
              <div>
                <p className="channel-name">{video.channel}</p>
                <p className="sub-count">1.2M subscribers</p>
              </div>
              <button className="subscribe-btn">Subscribe</button>
            </div>

            {/* ACTIONS */}
            <div className="action-buttons">
              <div className="like-dislike-group">
                <button>
                  <MdThumbUpOffAlt size={20} /> Like
                </button>
                <div className="divider"></div>
                <button>
                  <MdThumbDownOffAlt size={20} />
                </button>
              </div>

              <button>
                <MdShare size={20} /> Share
              </button>

              {/* DOWNLOAD */}
              <div className="download-wrapper">
                <button
                  className="download-btn"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <MdDownload size={20} /> Download
                </button>

                {showMenu && (
                  <div className="quality-menu">
                    <div onClick={handleDownload}>360p (MP4)</div>
                    <div onClick={handleDownload}>720p (HD)</div>
                    <div onClick={handleDownload}>Audio (MP3)</div>
                  </div>
                )}
              </div>

              <button>
                <MdPlaylistAdd size={20} /> Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="watch-recommendations">
        {videos.map((v) => (
          <Link
            to={`/watch/${v.id}?vid=${uuidv4()}`}
            key={v.id}
            className="recommendation-card"
          >
            <div className="rect-thumbnail">
              <img src={v.thumbnail} alt={v.title} />
            </div>
            <div className="rect-info">
              <p className="rect-title">{v.title}</p>
              <p className="rect-meta">{v.channel}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Watch;
