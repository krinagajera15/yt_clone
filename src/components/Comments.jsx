import React, { useState, useEffect } from "react";
import "./Comments.css";

const Comments = ({ videoId }) => {
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  const currentUser = loginData ? loginData.email : null;

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  // Load comments
  useEffect(() => {
    const allComments =
      JSON.parse(localStorage.getItem("videoComments")) || {};

    setComments(allComments[videoId] || []);
  }, [videoId]);

  // Add Comment
  const handleAddComment = () => {
    if (!currentUser) {
      alert("Please login to comment!");
      return;
    }

    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: currentUser,
      text: commentText,
      time: new Date().toLocaleString(),
    };

    const allComments =
      JSON.parse(localStorage.getItem("videoComments")) || {};

    const updatedComments = [newComment, ...(allComments[videoId] || [])];

    allComments[videoId] = updatedComments;

    localStorage.setItem(
      "videoComments",
      JSON.stringify(allComments)
    );

    setComments(updatedComments);
    setCommentText("");
  };

  // Delete Comment (Only Owner)
  const handleDelete = (commentId) => {
    const allComments =
      JSON.parse(localStorage.getItem("videoComments")) || {};

    const updated = comments.filter((c) => c.id !== commentId);

    allComments[videoId] = updated;

    localStorage.setItem(
      "videoComments",
      JSON.stringify(allComments)
    );

    setComments(updated);
  };

  return (
    <div className="comments-section">
      <h3>{comments.length} Comments</h3>

      {/* Add Comment */}
      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>

      {/* Comment List */}
      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <div className="comment-header">
              <strong>{c.user}</strong>
              <span>{c.time}</span>
            </div>

            <p>{c.text}</p>

            {currentUser === c.user && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(c.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
