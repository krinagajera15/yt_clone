import React, { useEffect, useState } from "react";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import "./Managevideo.css";
import Sidebaradmin from "../../components/Admin/SidebarAdmin";
import Navbaradmin from "../../components/Admin/NavbarAdmin";

const ManageVideoAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch videos
  const fetchVideos = async () => {
    try {
      const res = await fetch(
        "https://697343e3b5f46f8b5826ae3f.mockapi.io/videos"
      );
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Delete video
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      await fetch(
        `https://697343e3b5f46f8b5826ae3f.mockapi.io/videos/${id}`,
        { method: "DELETE" }
      );
      setVideos(videos.filter((v) => v.id !== id));
      setOpenMenuId(null);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVideos = videos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(videos.length / itemsPerPage);

  return (
    <div className="admin-container">
      <Sidebaradmin/>
      <main className="admin-main-content">
        <Navbaradmin/>
        <section className="admin-chart-section" style={{ marginTop: "30px" }}>
          <div className="admin-chart-wrapper">
            <div className="header-row">
              <span className="total-count">
                Total: {videos.length} Videos
              </span>
            </div>

            {loading ? (
              <p className="loading-text">Loading videos...</p>
            ) : (
              <>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Thumbnail</th>
                      <th>Title</th>
                      <th>Channel</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentVideos.map((video) => (
                      <tr key={video.id}>
                        <td>
                          <img
                            src={video.thumbnail}
                            alt="thumb"
                            className="video-thumb-img"
                          />
                        </td>
                        <td className="video-title-cell">{video.title}</td>
                        <td>{video.channel}</td>
                        <td className="action-cell">
                          <FiMoreVertical
                            className="menu-icon"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === video.id ? null : video.id
                              )
                            }
                          />

                          {openMenuId === video.id && (
                            <div className="action-menu">
                              <div className="action-item">
                                <FiEdit2 size={14} /> Edit
                              </div>
                              <div
                                className="action-item delete"
                                onClick={() => handleDelete(video.id)}
                              >
                                <FiTrash2 size={14} /> Delete
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManageVideoAdmin;
