import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewData = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [popupData, setPopupData] = useState(null); // State for popup content (image or QR code)
  const navigate = useNavigate();
  const [twoFAEnabled, setTwoFAEnabled] = useState(true); // 2FA enabled initially
  const [twoFAInput, setTwoFAInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track 2FA status
  const [errormsg,setError] = useState('')


  useEffect(() => {
    const value = localStorage.getItem('authorized');
    if(value){
      setIsAuthenticated(true);
    }
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://final-b-red.vercel.app/api/users');
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

    const verifyTwoFA = () => {
    const correctAnswer = 'harmony2024'; // Replace with your correct answer
    if (twoFAInput === correctAnswer) {
      setIsAuthenticated(true);
      localStorage.setItem('authorized', 'true');
    } else {
      setError('You got it right! But was it too easy? We were hoping for a brain-buster. Try again if you dare!')
    }
  };

  const handleCheckboxChange = async (userId, isChecked) => {
    try {
      await axios.put(`https://final-b-red.vercel.app/api/users/${userId}`, { isAllowed: isChecked });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAllowed: isChecked } : user
        )
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const downloadQRCode = (userName, userId) => {
    const canvas = document.createElement('canvas');
    const qrCanvas = document.getElementById(`qr-code-canvas-${userId}`);

    if (!qrCanvas) {
      console.error('QR Canvas not found');
      return;
    }

    // Increase the size for better quality
    const qrCodeSize = 120;  // Increase size for higher resolution
    const padding = 50;

    // Set canvas size to accommodate larger resolution
    canvas.width = qrCodeSize + padding * 2;
    canvas.height = qrCodeSize + 150;

    const context = canvas.getContext('2d');

    // Set the background to white
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Set the text style
    context.fillStyle = '#000000';
    context.font = '14px Arial'; // Increase font size for better visibility
    context.textAlign = 'center';
    context.fillText(userName, canvas.width / 2, 30);  // Adjusted position

    // Draw the QR code on the canvas with padding
    context.drawImage(qrCanvas, padding, 50, qrCodeSize, qrCodeSize);  
    context.fillText(`https://www.harmony4all.org`, canvas.width / 2, qrCodeSize + 80);

    // Add user ID text (smaller font size for the ID)

    // Generate a high-quality PNG image
    const pngUrl = canvas.toDataURL('image/png', 1.0); // '1.0' ensures maximum quality

    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `${userName}-qr.png`;
    a.click();
  };

  const handleEditClick = (userId) => {
    navigate(`/edit/${userId}`);
  };

  const handleDeletebtn = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`https://final-b-red.vercel.app/api/users/${userId}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handlePopupClose = () => {
    setPopupData(null); // Close the popup
  };

  const handleImageClick = (imageUrl) => {
    setPopupData({ type: 'image', content: imageUrl });
  };

  const handleQRCodeClick = (qrCanvasId) => {
    const qrCanvas = document.getElementById(qrCanvasId);
    if (qrCanvas) {
      const qrCodeUrl = qrCanvas.toDataURL('image/png');
      setPopupData({ type: 'qr', content: qrCodeUrl });
    }
  };

  const filteredUsers = users.filter((user) => {
    const lowercasedQuery = searchQuery.toLowerCase();

    // Combine first and last name
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();


    const matchesSearch =
      fullName.includes(lowercasedQuery) ||
      (user.email || '').toLowerCase().includes(lowercasedQuery) ||
      (user.work_email || '').toLowerCase().includes(lowercasedQuery) ||
      (user.phone || '').toLowerCase().includes(lowercasedQuery)

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isAllowed) ||
      (statusFilter === 'inactive' && !user.isAllowed);

    return matchesSearch && matchesStatus;
  });

   if (!isAuthenticated && twoFAEnabled) {
    return (
      <div className="center-auth-fa">
          <div className="logo-of-harmony-4alls">
    <img
      src="https://static.wixstatic.com/media/e65032_cd33c8b9dc8d4a4b986f7fa5ac06df3e~mv2.jpg/v1/crop/x_337,y_634,w_1319,h_753/fill/w_133,h_76,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Harmony%204%20All%20logo_G2%20(2).jpg"
      alt="Harmony 4All"
      className="logo-images"
       style={{
    width: "80px",
    height: "80px"}}
    />
  </div>
      <div className="two-fa-container">

        <h1>Brain Teaser</h1>
        <p style={{ textAlign: "center" }}>I bet you won't answer this question...</p>
        <p><strong>Which city is known as the "Big Apple"?</strong></p>
        <input
          type="text"
          value={twoFAInput}
          onChange={(e) => setTwoFAInput(e.target.value)}
          placeholder="Enter your answer"
        />
        <button onClick={verifyTwoFA}>Submit</button>
        <p style={{color:'red'}}>{errormsg}</p>
      </div>
    </div>
    );
  }
  return (
   <div className="view-data-container">
     
      {/* Filter Section */}
      <div className="filter-from-all-users">
  <div className="logo-of-harmony-4all">
    <img
      src="https://static.wixstatic.com/media/e65032_cd33c8b9dc8d4a4b986f7fa5ac06df3e~mv2.jpg/v1/crop/x_337,y_634,w_1319,h_753/fill/w_133,h_76,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Harmony%204%20All%20logo_G2%20(2).jpg"
      alt="Harmony 4All"
      className="logo-image"
    />
  </div>

  <h1>All Users</h1>

  <button className="add-user-btn-all-page" onClick={() => navigate('/qrform')}>
    Add User
  </button>
</div>

<div className="filter-meny-heren-sea">
  <div className="search-bar-container">
    <input
      type="text"
      placeholder="Search by name, email, phone, or address"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-bar-input"
    />
  </div>

  <div className="status-filter-container">
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="status-filter-dropdown"
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
</div>

      {/* User List */}
      <div className="user-list">
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="user-card">
              <div className={`status-text ${user.isAllowed ? 'active' : 'inactive'}`}>
                {user.isAllowed ? 'Active' : 'Inactive'}
              </div>

              <div className="flex-jfha">
                <div className="image-name-flexd">
                  {user.user_image && (
                    <img
                      src={`${user.user_image}`}
                      alt={`${user.user_image}'s profile`}
                      className="profile-image"
                      width="50px"
                      onClick={() => handleImageClick(`${user.user_image}`)} // Open in popup
                    />
                  )}
                  {user.first_name && <h3>{user.first_name} <br /> {user.last_name}</h3>}
                </div>
                <div className="flex-gap-bw-name">
                  {(user.email) && (
  <p>
    <strong>Email :</strong> {user.email}
  </p>
)}
                           {(user.work_email) && (
  <p>
    <strong>Work Email :</strong> {user.work_email}
  </p>
)}

                  {user.phone && <p><strong>Phone :</strong> {user.phone}</p>}
                      <p><strong>Address :</strong> {user.street}, {user.city}, {user.state}, {user.zip}</p>
                </div>
                <div className="flex-of-check-box-byn">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={user.isAllowed}
                      onChange={(e) => handleCheckboxChange(user._id, e.target.checked)}
                    />
                    <span> Show Qr Code</span>
                  </label>

                  <div className="action-btn-for-each-user">
                    {/* Edit Button */}
                    <button className="edit-btn" onClick={() => handleEditClick(user._id)}>
                      <i className="ri-edit-2-line"></i>
                    </button>

                    {/* Delete Button */}
                    <button className="delete-btn" onClick={() => handleDeletebtn(user._id)}>
                      <i className="ri-delete-bin-6-line"></i>
                    </button>
                  </div>
                </div>

                {user.isAllowed && (
                  <div className="qr-code-all">
                    <QRCodeCanvas
                      id={`qr-code-canvas-${user._id}`}
                      value={`https://harmony-4all.vercel.app/user/${user._id}`}
                      size={70}
                      onClick={() => handleQRCodeClick(`qr-code-canvas-${user._id}`)} // Open QR in popup
                    />
                    <button className="all-users-page-download-btn-qr" onClick={() => downloadQRCode(user.first_name, user._id)}>
                      <i className="ri-download-line"></i>
                    </button>
                  </div>
                )}
                <div className="flex-name-links">
                  <p>Social Links</p>
                  <div className="links-of-each-user">
                    <div className="map-flex">
                          <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${user.street}, ${user.city}, ${user.state}, ${user.zip}`
                            )}`}
                          >
                            <i className="ri-map-pin-fill"></i>
                          </a>

                    </div>
                    <div className="links-flex-all-user">
                      {(user.youtube_url || user.facebook_url || user.linkden_url || user.twitter_url) ? (
                        <>
                          {user.youtube_url && (
                            <a target='_blank' href={user.youtube_url}><i className="ri-youtube-fill"></i></a>
                          )}
                          {user.facebook_url && (
                            <a target='_blank' href={user.facebook_url}><i className="ri-facebook-fill"></i></a>
                          )}
                          {user.linkden_url && (
                            <a target='_blank' href={user.linkden_url}><i className="ri-linkedin-fill"></i></a>
                          )}
                          {user.twitter_url && (
                            <a target='_blank' href={user.twitter_url}><i className="ri-twitter-fill"></i></a>
                          )}
                        </>
                      ) : (
                        <h5>No social links available.</h5>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No users available.</p>
        )}
      </div>

      {/* Popup Modal */}
      {popupData && (
        <div className="popup-overlay" onClick={handlePopupClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {popupData.type === 'image' ? (
              <img src={popupData.content} alt="Popup" className="popup-image" />
            ) : (
              <img src={popupData.content} alt="QR Code Popup" className="popup-qr-code" />
            )}
            <button className="close-popup-btn" onClick={handlePopupClose}>x</button>
          </div>
        </div>
      )}
    </div>
  );
}; 
    

export default ViewData;
