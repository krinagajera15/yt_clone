import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Watch.css";
import {
  MdThumbUp,
  MdThumbDown,
  MdThumbUpOffAlt,
  MdThumbDownOffAlt,
  MdShare,
  MdPlaylistAdd,
  MdDownload,
  MdNotificationsActive,
} from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import Comments from "../components/Comments";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const loginData = JSON.parse(localStorage.getItem("loginData"));
  const userEmail = loginData ? loginData.email : null;
  const currentUserId = loginData ? loginData.id : "guest";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resVideo = await fetch(
          `https://697343e3b5f46f8b5826ae3f.mockapi.io/videos/${id}`
        );
        if (!resVideo.ok) throw new Error("Video not found");

        const videoData = await resVideo.json();
        setVideo(videoData);
        setLikesCount(Number(videoData.likes) || 0);

        const userInteractions =
          JSON.parse(localStorage.getItem(`interactions_${currentUserId}`)) || {};

        setIsLiked(userInteractions[id]?.liked || false);
        setIsDisliked(userInteractions[id]?.disliked || false);

        if (userEmail) {
          const allSubs =
            JSON.parse(localStorage.getItem("subscribedChannels")) || {};
          const userSubs = allSubs[userEmail] || [];
          const alreadySub = userSubs.some((v) => v.id === videoData.id);
          setIsSubscribed(alreadySub);
        }

        const resAll = await fetch(
          "https://697343e3b5f46f8b5826ae3f.mockapi.io/videos"
        );
        const allData = await resAll.json();
        setVideos(allData.filter((v) => v.id !== id));

        setError("");
      } catch (err) {
        setError("Video loading Error 😕");
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, userEmail, currentUserId]);

  // ================= LIKE =================
  const handleLike = () => {
    if (!loginData) {
      alert("Please login to like videos!");
      navigate("/login");
      return;
    }

    const userInteractions =
      JSON.parse(localStorage.getItem(`interactions_${currentUserId}`)) || {};

    let newLikes = likesCount;

    if (isLiked) {
      newLikes = Math.max(0, likesCount - 1);
      setIsLiked(false);
      userInteractions[id] = { liked: false, disliked: false };
    } else {
      newLikes = likesCount + 1;
      setIsLiked(true);
      setIsDisliked(false);
      userInteractions[id] = { liked: true, disliked: false };
    }

    setLikesCount(newLikes);
    localStorage.setItem(
      `interactions_${currentUserId}`,
      JSON.stringify(userInteractions)
    );

    updateLikesOnServer(id, newLikes);
  };

  // ================= DISLIKE =================
  const handleDislike = () => {
    if (!loginData) {
      alert("Please login to dislike videos!");
      navigate("/login");
      return;
    }

    const userInteractions =
      JSON.parse(localStorage.getItem(`interactions_${currentUserId}`)) || {};

    let newLikes = likesCount;

    if (isDisliked) {
      setIsDisliked(false);
      userInteractions[id] = { liked: false, disliked: false };
    } else {
      if (isLiked) {
        newLikes = Math.max(0, likesCount - 1);
      }

      setIsLiked(false);
      setIsDisliked(true);
      userInteractions[id] = { liked: false, disliked: true };
    }

    setLikesCount(newLikes);
    localStorage.setItem(
      `interactions_${currentUserId}`,
      JSON.stringify(userInteractions)
    );

    updateLikesOnServer(id, newLikes);
  };

  const updateLikesOnServer = (videoId, count) => {
    fetch(
      `https://697343e3b5f46f8b5826ae3f.mockapi.io/videos/${videoId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: count }),
      }
    );
  };

  // ================= SUBSCRIBE =================
  const handleSubscribe = () => {
    if (!loginData) {
      alert("Please login to subscribe!");
      navigate("/login");
      return;
    }

    let allSubs =
      JSON.parse(localStorage.getItem("subscribedChannels")) || {};
    let userSubs = allSubs[userEmail] || [];

    if (isSubscribed) {
      userSubs = userSubs.filter((v) => v.id !== video.id);
      setIsSubscribed(false);
    } else {
      userSubs.push({
        id: video.id,
        channel: video.channel,
        channelImage: video.channelImage,
        thumbnail: video.thumbnail,
        title: video.title,
      });
      setIsSubscribed(true);
    }

    allSubs[userEmail] = userSubs;
    localStorage.setItem("subscribedChannels", JSON.stringify(allSubs));
  };

  // ================= DOWNLOAD =================
  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDownload = async () => {
    if (!video) return;

    const videoId = getYouTubeID(video.url);

    if (!videoId) {
      alert("YouTube Video ID not found!");
      return;
    }

    const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      await navigator.clipboard.writeText(ytUrl);
      setShowMenu(false);

      alert(
        "Click Ok to Open download page \nPaste the Link Using Ctrl + V In Inputbox"
      );

      window.open("https://vidssave.com/yt/", "_blank");
    } catch {
      alert("Clipboard permission denied!");
    }
  };

  if (error) return <div className="watch-page error-text">{error}</div>;
  if (!video) return <div className="watch-page loading-text">Loading...</div>;

  return (
    <div className="watch-container">
      <div className="watch-main">
        <div className="video-container">
          <iframe
            src={video.url}
            title={video.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <div className="video-details">
          <h1 className="watch-title">{video.title}</h1>

          {/* Channel + Actions */}
          <div className="video-actions-row">
            <div className="channel-info">
              <img
                src={video.channelImage || "https://via.placeholder.com/40"}
                className="channel-avatar-img"
                alt="logo"
              />
              <div>
                <p className="channel-name">{video.channel}</p>
                <p className="sub-count">1.2M subscribers</p>
              </div>

              <button
                className={`subscribe-btn ${
                  isSubscribed ? "subscribed" : ""
                }`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? (
                  <>
                    Subscribed{" "}
                    <MdNotificationsActive
                      size={18}
                      style={{ marginLeft: "5px" }}
                    />
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>

            <div className="action-buttons">
              <div className="like-dislike-group">
                <button onClick={handleLike}>
                  {isLiked ? (
                    <MdThumbUp size={20} color="#3ea6ff" />
                  ) : (
                    <MdThumbUpOffAlt size={20} />
                  )}
                  <span style={{ marginLeft: "5px" }}>{likesCount}</span>
                </button>

                <div className="divider"></div>

                <button onClick={handleDislike}>
                  {isDisliked ? (
                    <MdThumbDown size={20} color="#ff4e4e" />
                  ) : (
                    <MdThumbDownOffAlt size={20} />
                  )}
                </button>
              </div>

              <button>
                <MdShare size={20} /> Share
              </button>

              {/* ✅ DOWNLOAD BUTTON */}
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

        {/* ✅ COMMENTS SECTION */}
        <Comments videoId={id} />
      </div>

      {/* Recommendations */}
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
