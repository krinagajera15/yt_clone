import React, { useEffect, useState } from 'react';
import './ChanelData.css';
import Sidebaradmin from '../../components/Admin/SidebarAdmin';
import Navbaradmin from '../../components/Admin/NavbarAdmin';

const ChannelAdmin = () => {
  const [channels, setChannels] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    c_name: '',
    c_image: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const apiUrl = 'https://69809eaa6570ee87d50fd891.mockapi.io/channelsdata';

  // 🔹 Fetch Channels
  const fetchChannels = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setChannels(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // 🔹 Edit Click
  const handleEditClick = (channel) => {
    setEditingId(channel.id);
    setEditFormData({
      c_name: channel.c_name,
      c_image: channel.c_image
    });
  };

  // 🔹 Image Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditFormData({
        ...editFormData,
        c_image: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Save Update
  const handleSave = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      setEditingId(null);
      fetchChannels();
    } catch (err) {
      alert('Update failed');
    }
  };

  // 🔹 Delete Channel
  const handleDelete = async (id) => {
    if (window.confirm('Delete this channel?')) {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      fetchChannels();
    }
  };

  // 🔹 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const currentData = channels.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(channels.length / itemsPerPage);

  return (
    <div className="admin-container">
      <Sidebaradmin/>
      <main className="admin-main-content">
        <Navbaradmin/>  
        <section className="channel-section">
          <table className="channel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Channel Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((ch) => (
                <tr key={ch.id}>
                  <td>{ch.id}</td>

                  {/* IMAGE COLUMN */}
                  <td>
                    {editingId === ch.id ? (
                      <div className="image-edit-box">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {editFormData.c_image && (
                          <img
                            src={editFormData.c_image}
                            alt="preview"
                            className="table-img preview"
                          />
                        )}
                      </div>
                    ) : (
                      <img
                        src={ch.c_image}
                        alt="channel"
                        className="table-img"
                        onError={(e) =>
                          (e.target.src = 'https://via.placeholder.com/80')
                        }
                      />
                    )}
                  </td>

                  {/* NAME COLUMN */}
                  <td>
                    {editingId === ch.id ? (
                      <input
                        value={editFormData.c_name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            c_name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      ch.c_name
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    {editingId === ch.id ? (
                      <button onClick={() => handleSave(ch.id)}>Save</button>
                    ) : (
                      <button onClick={() => handleEditClick(ch)}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(ch.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChannelAdmin;
