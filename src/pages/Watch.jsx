import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import "./Watch.css";
import {
  MdThumbUpOffAlt,
  MdThumbDownOffAlt,
  MdShare,
  MdPlaylistAdd,
  MdDownload,
  MdNotificationsActive, // સબસ્ક્રાઇબ માટે ઘંટડી
} from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // સબસ્ક્રિપ્શન સ્ટેટ
  const location = useLocation();

  // લોગિન થયેલા યુઝરનો ડેટા મેળવો
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  const userEmail = loginData ? loginData.email : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resVideo = await fetch(`https://697343e3b5f46f8b5826ae3f.mockapi.io/videos/${id}`);
        if (!resVideo.ok) throw new Error("Video not found");
        const videoData = await resVideo.json();
        setVideo(videoData);

        // ચેક કરો કે આ યુઝરે આ ચેનલ સબસ્ક્રાઇબ કરી છે?
        if (userEmail) {
          const allSubs = JSON.parse(localStorage.getItem("subscribedChannels")) || {};
          const userSubs = allSubs[userEmail] || [];
          const alreadySub = userSubs.some((v) => v.id === videoData.id);
          setIsSubscribed(alreadySub);
        }

        const resAll = await fetch("https://697343e3b5f46f8b5826ae3f.mockapi.io/videos");
        const allData = await resAll.json();
        setVideos(allData.filter((v) => v.id !== id));
        setError("");
      } catch (err) {
        setError("Video loading Error 😕");
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, userEmail]);

  const handleSubscribe = () => {
    if (!loginData) {
      alert("Please login to subscribe!");
      navigate("/login");
      return;
    }

    let allSubs = JSON.parse(localStorage.getItem("subscribedChannels")) || {};
    let userSubs = allSubs[userEmail] || [];

    if (isSubscribed) {
      // Unsubscribe: લિસ્ટમાંથી રિમૂવ કરો
      userSubs = userSubs.filter((v) => v.id !== video.id);
      setIsSubscribed(false);
    } else {
      // Subscribe: લિસ્ટમાં એડ કરો
      userSubs.push({
        id: video.id,
        channel: video.channel,
        channelImage: video.channelImage,
        thumbnail: video.thumbnail,
        title: video.title
      });
      setIsSubscribed(true);
    }

    allSubs[userEmail] = userSubs;
    localStorage.setItem("subscribedChannels", JSON.stringify(allSubs));
  };

  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDownload = () => {
    const videoId = getYouTubeID(video.url);
    if (videoId) {
      const downloadUrl = `https://en.savefrom.net/1-youtube-video-downloader-380/?url=https://www.youtube.com/watch?v=${videoId}`;
      window.open(downloadUrl, "_blank");
      setShowMenu(false);
    }
  };

  if (error) return <div className="watch-page error-text">{error}</div>;
  if (!video) return <div className="watch-page loading-text">Loading...</div>;

  return (
    <div className="watch-container">
      <div className="watch-main">
        <div className="video-container">
          <iframe src={video.url} title={video.title} frameBorder="0" allowFullScreen></iframe>
        </div>

        <div className="video-details">
          <h1 className="watch-title">{video.title}</h1>
          <div className="video-actions-row">
            <div className="channel-info">
              <img src={video.channelImage || "https://via.placeholder.com/40"} className="channel-avatar-img" alt="logo" />
              <div>
                <p className="channel-name">{video.channel}</p>
                <p className="sub-count">1.2M subscribers</p>
              </div>
              
              {/* Subscribe Button with Bell Icon */}
              <button 
                className={`subscribe-btn ${isSubscribed ? "subscribed" : ""}`} 
                onClick={handleSubscribe}
              >
                {isSubscribed ? (
                  <>
                    Subscribed <MdNotificationsActive size={18} style={{ marginLeft: "5px" }} />
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>

            <div className="action-buttons">
              <div className="like-dislike-group">
                <button><MdThumbUpOffAlt size={20} /> Like</button>
                <div className="divider"></div>
                <button><MdThumbDownOffAlt size={20} /></button>
              </div>
              <button><MdShare size={20} /> Share</button>

              <div className="download-wrapper">
                <button className="download-btn" onClick={() => setShowMenu(!showMenu)}>
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
              <button><MdPlaylistAdd size={20} /> Save</button>
            </div>
          </div>
        </div>
      </div>

      <div className="watch-recommendations">
        {videos.map((v) => (
          <Link to={`/watch/${v.id}?vid=${uuidv4()}`} key={v.id} className="recommendation-card">
            <div className="rect-thumbnail"><img src={v.thumbnail} alt={v.title} /></div>
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