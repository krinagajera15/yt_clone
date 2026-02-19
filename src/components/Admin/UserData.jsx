import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import './UserData.css';
import Sidebaradmin from '../../components/Admin/SidebarAdmin';
import Navbaradmin from '../../components/Admin/NavbarAdmin';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const apiUrl = "https://697343e3b5f46f8b5826ae3f.mockapi.io/users";

  // ✅ Fetch users (ASYNC / AWAIT)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Delete user (ASYNC / AWAIT)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id)
      );
    } catch (error) {
      alert("Failed to delete user");
      console.error(error);
    }
  };

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="admin-container">
      <Sidebaradmin/>
      <main className="admin-main-content">
        <Navbaradmin/>
        <section className="admin-chart-section" style={{ marginTop: '30px' }}>
          <div className="admin-chart-wrapper">
            <div className="table-header-flex">
              <h3 className="admin-section-title">Registered Users List</h3>
              <span className="total-count-badge">
                {users.length} Total Users
              </span>
            </div>

            {loading ? (
              <div className="loading-text">Loading users...</div>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email Address</th>
                    <th>Password</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td className="user-name-cell">{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <code className="pass-code">
                          {user.password}
                        </code>
                      </td>
                      <td>
                        <button
                          className="user-delete-btn"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

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
                  className={currentPage === index + 1 ? 'active' : ''}
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserManager;
