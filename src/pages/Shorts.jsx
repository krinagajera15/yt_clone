import React, { useEffect, useState, useRef } from "react";
import "./Shorts.css";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import { BiCommentDetail } from "react-icons/bi";
import { RiShareForwardFill } from "react-icons/ri";

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const iframeRefs = useRef([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("shorts")) || [];
    const formattedData = data.map(item => ({
      ...item,
      isLiked: false,
      isDisliked: false,
      displayLikes: item.likes || 0
    }));
    setShorts(formattedData);
  }, []);

  // ✅ Auto Play + Restart Video Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const iframe = entry.target;

          if (entry.isIntersecting) {
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"seekTo","args":[0,true]}',
              "*"
            );
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              "*"
            );
          } else {
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"stopVideo","args":""}',
              "*"
            );
          }
        });
      },
      { threshold: 0.6 }
    );

    iframeRefs.current.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, [shorts]);

  const handleLike = id => {
    setShorts(prev =>
      prev.map(short => {
        if (short.id === id) {
          const liked = !short.isLiked;
          return {
            ...short,
            isLiked: liked,
            isDisliked: false,
            displayLikes: liked
              ? (short.likes || 0) + 1
              : short.likes || 0
          };
        }
        return short;
      })
    );
  };

  const handleDislike = id => {
    setShorts(prev =>
      prev.map(short => {
        if (short.id === id) {
          return {
            ...short,
            isDisliked: !short.isDisliked,
            isLiked: false
          };
        }
        return short;
      })
    );
  };

  return (
    <div className="shorts-wrapper">
      {shorts.map((short, index) => (
        <div className="short-card" key={short.id}>
          
          <div className="short-video-container">
            <iframe
              ref={el => (iframeRefs.current[index] = el)}
              src={`https://www.youtube.com/embed/${short.videoId}?enablejsapi=1&controls=1&rel=0`}
              title={short.title}
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
            ></iframe>
          </div>

          {/* Right Sidebar */}
          <div className="short-right-sidebar">
            <div className="short-action-item" onClick={() => handleLike(short.id)}>
              <div className={`short-icon-circle ${short.isLiked ? "liked" : ""}`}>
                <SlLike size={26} />
              </div>
              <span>{short.displayLikes}</span>
            </div>

            <div
              className="short-action-item"
              onClick={() => handleDislike(short.id)}
            >
              <div
                className={`short-icon-circle ${
                  short.isDisliked ? "disliked" : ""
                }`}
              >
                <SlDislike size={26} />
              </div>
              <span>Dislike</span>
            </div>

            <div className="short-action-item">
              <div className="short-icon-circle">
                <BiCommentDetail size={24} />
              </div>
              <span>{short.comments}</span>
            </div>

            <div className="short-action-item">
              <div className="short-icon-circle">
                <RiShareForwardFill size={24} />
              </div>
              <span>Share</span>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="short-info-overlay">
            <div className="short-profile-row">
              <div className="short-avatar-placeholder"></div>
              <span className="short-username">@adityagoswami</span>
              <button className="short-subscribe-button">Subscribe</button>
            </div>
            <p className="short-short-title">{short.title}</p>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Shorts;
