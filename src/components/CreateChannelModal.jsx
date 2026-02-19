import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateChannelModal.css";
import Modecontext from "../Context/ModeContext";

const CreateChannelModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [channelId, setChannelId] = useState(null);
  
  const navigate = useNavigate();
  const ctx = useContext(Modecontext);

  const API_URL = "https://69809eaa6570ee87d50fd891.mockapi.io/channelsdata";
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  const userEmail = loginData?.email;

  useEffect(() => {
    if (isOpen && userEmail) {
      const allChannels = JSON.parse(localStorage.getItem("userChannels")) || {};
      const existingChannel = allChannels[userEmail];
      
      if (existingChannel) {
        // જો ડેટા પહેલેથી હોય તો સ્ટેટમાં ભરો
        setName(existingChannel.c_name);
        setImage(existingChannel.c_image);
        setChannelId(existingChannel.id); // API માં અપડેટ કરવા માટે ID
        setIsEditing(true);
      } else {
        setIsEditing(false);
        setName("");
        setImage(null);
      }
    }
  }, [isOpen, userEmail]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!userEmail) return alert("Please login first!");
    if (!name || !image) return alert("Channel name and image are required");

    const channelData = {
      c_name: name,
      c_image: image,
      userEmail: userEmail
    };

    try {
      let response;
      if (isEditing && channelId) {
        // --- UPDATE (PUT) LOGIC ---
        response = await fetch(`${API_URL}/${channelId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(channelData),
        });
      } else {
        // --- CREATE (POST) LOGIC ---
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(channelData),
        });
      }

      if (response.ok) {
        const savedData = await response.json();
        const allChannels = JSON.parse(localStorage.getItem("userChannels")) || {};
        allChannels[userEmail] = savedData;
        localStorage.setItem("userChannels", JSON.stringify(allChannels));

        alert(isEditing ? "Channel Updated Successfully! ✨" : "Channel Created Successfully! 🎉");
        onClose();
      } else {
        alert("Server error, please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="create-channel-overlay" onClick={onClose}>
      <div className={`create-channel-modal ${ctx?.mode}`} onClick={(e) => e.stopPropagation()}>
        <h2 className="chenl-title-class">{isEditing ? "Edit Your Channel" : "Create Your Channel"}</h2>

        <div className="image-upload">
          <div className="image-preview" style={{width:'100px', height:'100px', margin:'auto', overflow:'hidden', borderRadius:'50%', border:'1px solid #ccc'}}>
            {image ? <img src={image} alt="Channel" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div className="placeholder">Select Logo</div>}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <input
          type="text"
          placeholder="Enter Channel Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={handleSubmit} className="createchenal-btn">
          {isEditing ? "Update Channel" : "Create Channel"}
        </button>
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateChannelModal;