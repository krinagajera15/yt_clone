import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Subscription.css";

export const Subscriptionpage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userSubs, setUserSubs] = useState([]);

  // 1. loginData ને સીધું અહીંયા જ મેળવો (બહાર રાખવાની જરૂર નથી)
  const loginData = JSON.parse(localStorage.getItem("loginData"));

  useEffect(() => {
    // 2. અહીંયા ચેક કરો કે લોગિન છે કે નહીં
    if (loginData && loginData.email) {
      const allSubs = JSON.parse(localStorage.getItem("subscribedChannels")) || {};
      const currentSubs = allSubs[loginData.email] || [];
      
      // સ્ટેટ અપડેટ ત્યારે જ કરો જો ડેટા અલગ હોય
      setUserSubs(currentSubs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 3. અહીંયા ખાલી એરે [] રાખવાથી લૂપ અટકી જશે

  const handleSignIn = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  const handleUnsubscribe = (channelId) => {
    if (!loginData?.email) return;
  
    const allSubs = JSON.parse(localStorage.getItem("subscribedChannels")) || {};
    const currentSubs = allSubs[loginData.email] || [];
  
    // Remove selected channel
    const updatedSubs = currentSubs.filter(
      (channel) => channel.id !== channelId
    );
  
    // Update localStorage
    allSubs[loginData.email] = updatedSubs;
    localStorage.setItem("subscribedChannels", JSON.stringify(allSubs));
  
    // Update state
    setUserSubs(updatedSubs);
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
                  <th>Action</th>
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
                    <td>
                      <button 
                        className="unsubscribe-btn"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to unsubscribe?")) {
                            handleUnsubscribe(channel.id);
                          }
                        }}
                      >
                        Unsubscribe
                      </button>
                    </td>
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