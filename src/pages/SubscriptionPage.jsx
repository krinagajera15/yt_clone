import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // location ઉમેર્યું
import "./Subscription.css";

export const Subscriptionpage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // અત્યારનો પાથ જાણવા માટે
  const [userSubs, setUserSubs] = useState([]);

  const loginData = JSON.parse(localStorage.getItem("loginData"));

  useEffect(() => {
    if (loginData && loginData.email) {
      const allSubs = JSON.parse(localStorage.getItem("subscribedChannels")) || {};
      const currentSubs = allSubs[loginData.email] || [];
      setUserSubs(currentSubs);
    }
  }, [loginData]);

  const handleSignIn = () => {
    // navigate કરતી વખતે 'state' માં વર્તમાન પાથ (pathname) મોકલો
    navigate("/login", { state: { from: location.pathname } });
  };

  return (
    <>
      {!loginData ? (
        <div className="main-subscript-class">
          <h1 className="main-subscript-description-class">
            Subscription Page Not Found
          </h1>
          <h1 className="subscript-detail-class">Please Sign In</h1>
          <button className="btn-signin-class" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      ) : (
        <div className="subscription-list">
          <h2>Your Subscriptions</h2>
          {userSubs.length > 0 ? (
            <table className="subscription-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Logo</th>
                  <th>Channel Name</th>
                </tr>
              </thead>
              <tbody>
                {userSubs.map((channel, index) => (
                  <tr key={channel.id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <img 
                        src={channel.channelImage || "https://via.placeholder.com/40"} 
                        alt="logo" 
                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    </td>
                    <td>{channel.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-subs-message">
              <p>You haven't subscribed to any channels yet.</p>
              <button onClick={() => navigate("/")} className="btn-signin-class" style={{marginTop: "10px"}}>
                Browse Videos
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};