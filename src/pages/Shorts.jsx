import React, { useEffect, useState, useRef } from "react";
import "./Shorts.css";
import { SlLike, SlDislike } from "react-icons/sl";
import { BiCommentDetail } from "react-icons/bi";
import { RiShareForwardFill } from "react-icons/ri";

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const iframeRefs = useRef([]);

  const loggedInUser = JSON.parse(localStorage.getItem("loginData"));
  const currentUserId = loggedInUser?.id || "guest";

  const CHANNELS_API = "https://69809eaa6570ee87d50fd891.mockapi.io/channelsdata";

  const loadData = async () => {
    try {
      const globalShorts = JSON.parse(localStorage.getItem("shorts")) || [];
      const userInteractions = JSON.parse(localStorage.getItem(`interactions_${currentUserId}`)) || {};

      const channelRes = await fetch(CHANNELS_API);
      const channelsData = await channelRes.json();

      const formattedData = globalShorts.map(short => {
        const channelFromAPI = channelsData.find(c => c.userEmail === short.userEmail);
        return {
          ...short,
          isLiked: userInteractions[short.id]?.liked || false,
          isDisliked: userInteractions[short.id]?.disliked || false,
          likes: Number(short.likes) || 0,
          comments: short.comments || 0,
          displayChannelName: channelFromAPI
            ? `@${channelFromAPI.c_name}`
            : (short.channel ? `@${short.channel}` : "@User"),
          displayChannelImage: channelFromAPI
            ? channelFromAPI.c_image
            : (short.c_image ? short.c_image : null)
        };
      });

      setShorts(formattedData);
    } catch (error) {
      console.error("Error loading data:", error);
      const localOnly = (JSON.parse(localStorage.getItem("shorts")) || []).map(s => ({
        ...s,
        displayChannelName: s.channel ? `@${s.channel}` : "@User",
        displayChannelImage: s.c_image || null
      }));
      setShorts(localOnly);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [currentUserId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const iframe = entry.target;
          if (entry.isIntersecting) {
            iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0,true]}', "*");
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
          } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', "*");
          }
        });
      },
      { threshold: 0.6 }
    );

    iframeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [shorts]);

  // ========== LIKE / DISLIKE ==========

  const handleLike = (id) => {
    if (!loggedInUser) {
      alert("Please login to like shorts!");
      return;
    }

    const userInteractions = JSON.parse(localStorage.getItem(`interactions_${currentUserId}`)) || {};
    const globalData = JSON.parse(localStorage.getItem("shorts")) || [];

    const updatedData = globalData.map(short => {
      if (short.id === id) {
        let likes = Number(short.likes) || 0;
        if (userInteractions[id]?.liked) {
          likes = Math.max(0, likes - 1);
          userInteractions[id] = { liked: false, disliked: false };
        } else {
          likes += 1;
          userInteractions[id] = { liked: true, disliked: false };
        }
        return { ...short, likes };
      }
      return short;
    });

    localStorage.setItem("shorts", JSON.stringify(updatedData));
    localStorage.setItem(`interactions_${currentUserId}`, JSON.stringify(userInteractions));
    loadData();
  };

  const handleDislike = (id) => {
    if (!loggedInUser) {
      alert("Please login to dislike shorts!");
      return;
    }

    const userInteractions = JSON.parse(localStorage.getItem(`interactions_${currentUserId}`)) || {};
    const globalData = JSON.parse(localStorage.getItem("shorts")) || [];

    const updatedData = globalData.map(short => {
      if (short.id === id) {
        let likes = Number(short.likes) || 0;
        if (userInteractions[id]?.disliked) {
          userInteractions[id] = { liked: false, disliked: false };
        } else {
          if (userInteractions[id]?.liked) likes = Math.max(0, likes - 1);
          userInteractions[id] = { liked: false, disliked: true };
        }
        return { ...short, likes };
      }
      return short;
    });

    localStorage.setItem("shorts", JSON.stringify(updatedData));
    localStorage.setItem(`interactions_${currentUserId}`, JSON.stringify(userInteractions));
    loadData();
  };

  const formatLikes = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  // ========== JSX ==========

  return (
    <div className="shorts-wrapper">
      {shorts.map((short, index) => (
        <div className="short-card" key={short.id}>
          <div className="short-video-container">
            <iframe
              ref={el => (iframeRefs.current[index] = el)}
              src={`https://www.youtube.com/embed/${short.videoId}?enablejsapi=1&rel=0&controls=0&modestbranding=1`}
              title={short.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="short-right-sidebar">
            <div className="short-action-item" onClick={() => handleLike(short.id)}>
              <div className={`short-icon-circle ${short.isLiked ? "active-like" : ""}`}>
                <SlLike size={24} />
              </div>
              <span>{formatLikes(short.likes)}</span>
            </div>

            <div className="short-action-item" onClick={() => handleDislike(short.id)}>
              <div className={`short-icon-circle ${short.isDisliked ? "active-dislike" : ""}`}>
                <SlDislike size={24} />
              </div>
              <span>Dislike</span>
            </div>

            <div className="short-action-item">
              <div className="short-icon-circle"><BiCommentDetail size={24} /></div>
              <span>{short.comments || 0}</span>
            </div>

            <div className="short-action-item">
              <div className="short-icon-circle"><RiShareForwardFill size={24} /></div>
              <span>Share</span>
            </div>
          </div>

          <div className="short-info-overlay">
            <div className="short-profile-row">
              <div className="short-avatar">
                {short.displayChannelImage ? (
                  <img src={short.displayChannelImage} alt="logo" style={{width:'100%', height:'100%', borderRadius:'50%'}} />
                ) : (
                  short.displayChannelName.charAt(1).toUpperCase()
                )}
              </div>
              <span className="short-username">{short.displayChannelName}</span>
              <button className="short-subscribe-btn">Subscribe</button>
            </div>
            <p className="short-title-text">{short.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shorts;
