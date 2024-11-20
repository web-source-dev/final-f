import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalImage, setModalImage] = useState(''); // Store the image URL for modal

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://final-b-red.vercel.app/api/users/${userId}`);
        console.log(response.data);
        setUser(response.data); // Set the user data
        setErrorMessage(''); // Clear error message if the user is found
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Handle blocked user case
          setErrorMessage('User does not exist');
        } else {
          // Handle other errors (e.g., user not found)
          setErrorMessage('User does not exist');
        }
        setUser(null); // Clear user data in case of error
      }
    };

    fetchUser();
  }, [userId]);

  // Function to download the vCard
  const downloadVCard = () => {
    if (user) {
      const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${user.first_name}
TEL:${user.phone || ''}
EMAIL:${user.email || ''}
ORG:${user.organization || ''}
END:VCARD`;

      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${user.first_name.replace(' ', '_')}_contact.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Function to open the modal with the image
  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true); // Open the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setModalImage(''); // Clear the image URL
  };

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>; // Display the error message if any
  }

  if (!user) {
    return <p className="loading-message">Loading...</p>; // Show loading state while user data is being fetched
  }

  return (
    <div className="user-details-containereds">
      <div className="center-user-details">
      <div className="hormony-monogram-head">
        <h3>Harmony 4 All</h3>
      </div>
        <div className="user-details-cardsds">
          <div className="left-pane-cards">
            <div className="image-name-flex">
              {user.user_image && (
                <img
                  src={`${user.user_image}`} // Fix the path here
                  alt={`${user.user_image}'s profile`}
                  className="profile-image"
                  onClick={() => openModal(user.user_image)} // Open modal when image is clicked
                />
              )}
              {user.first_name && <h3 className='name-color-h3'>{user.first_name} {user.last_name}</h3>}
            </div>
              <div className="details-of-each-user-under-image">
                
            <div className="email-outside-box-icon">
            <i class="ri-mail-fill"></i>
            <div className="email-inside-box">
            {user.email && (
              <div className="user-detail-itemds">
                <strong>Personal Email:</strong> {user.email}
              </div>
            )}
            {user.work_email && (
              <div className="user-detail-itemds">
                <strong>Work Email:</strong> {user.work_email}
              </div>
            )}
            </div>
            </div>
            <div className="email-outside-box-icon">
            <i class="ri-phone-fill"></i>
            <div className="email-inside-box">
            {user.phone && (
              <div className="user-detail-itemds">
                <strong>Phone:</strong> {user.phone}
              </div>
            )}
            </div>
            </div>
            <div className="email-outside-box-icon">
            <i class="ri-map-pin-fill"></i>
            <div className="email-inside-box">
              <div className="user-detail-itemd-adds">
                    <p><strong>Address :</strong> {user.street}, {user.city}, {user.state}, {user.zip}</p>
              </div>
            </div>
            </div>
            <div className="email-outside-box-icon">
            <i class="ri-organization-chart"></i>
            <div className="email-inside-box">
            {user.organization && (
              <div className="user-detail-itemd-adds">
                <strong>Organization:</strong> {user.organization}
              </div>
            )}
            </div>
            </div>
          </div>

              </div>
          <div className="right-pane-cards">
            <strong></strong>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${user.street}, ${user.city}, ${user.state}, ${user.zip}`
                  )}`}
                >
                  <i className="ri-map-pin-fill"></i>
                </a>

            <strong></strong>
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
              <p>No <br /> social <br /> links <br /> available.</p>
            )}
          </div>
        </div>

        {/* Add a button to download vCard */}
        <button className='save-contact-btns' onClick={downloadVCard}>Save</button>
      </div>

      {/* Modal for displaying the image */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={modalImage} alt="Profile" className="modal-image" />
            <button className="close-modal" style={{opacity:0}} onClick={closeModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;

