import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateChannelModal.css";
import Modecontext from "../Context/ModeContext";

const CreateChannelModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const ctx=useContext(Modecontext);
  

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = () => {
    if (!name && !image) return alert("Channel name and image are required");
    if (!name) return alert("Channel name is required");
    if (!image) return alert("Channel image is required");

    const newChannel = {
      id: Date.now(),
      name,
      image,
    };

    // Redirect to AddVideo page with channel state
    navigate("/admin/add-video", { state: { channel: newChannel } });

    // Reset fields & close modal
    setName("");
    setImage(null);
    onClose();
  };

  return (
    <div className="create-channel-overlay">
      <div className={`create-channel-modal ${ctx?.mode}`} onClick={(e) => e.stopPropagation()}>
        <h2 className="chenl-title-class">Create Channel</h2>

        <div className="image-upload">
          <div className="image-preview">
            {image ? <img src={image} alt="Channel" /> : <div className="placeholder">Select picture</div>}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <input
          type="text"
          placeholder="Channel Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={handleSubmit}>Create Channel</button>
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateChannelModal;
