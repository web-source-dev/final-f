import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditQRForm = () => {
  const { userId } = useParams();  // Get the user ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    work_email: '',
    organization: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    youtube_url: '',
    facebook_url: '',
    linkden_url: '',
    twitter_url: '',
    user_image: null,
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state for form submission

  // Cloudinary credentials directly set in code
  const cloudName = 'dcvqytwuq';
  const uploadPreset = 'my_qr_preset';

  // Load the current user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://final-b-red.vercel.app/api/users/${userId}`);
        console.log(response.data);  // Log the user data for debugging
        setFormData({
          ...response.data,
          user_image: response.data.user_image || null,  // Don't overwrite image if already set
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        setMessage('Error loading user data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    // Validate file type and size
    if (file && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setMessage('Invalid image format. Please upload a JPEG, PNG, or GIF file.');
        setMessageType('error');
        return;
    }
  
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('File size exceeds the 5MB limit.');
        setMessageType('error');
        return;
    }
  
    // Prepare the form data for Cloudinary upload
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', uploadPreset);
    uploadData.append('cloud_name', cloudName);
  
    try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, uploadData);
        if (response.status === 200) {
            setFormData((prev) => ({
              ...prev,
              user_image: response.data.secure_url // Set the Cloudinary image URL here
            }));
            setMessage('Image uploaded successfully.');
            setMessageType('success');
        }
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        setMessage('Error uploading image. Please try again.');
        setMessageType('error');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Prepare form data to be sent to the backend
    const dataToSubmit = {
      ...formData,  // Include the current form data
      user_image: formData.user_image || null, // Ensure the image field is not null
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/qrdata/${userId}`,
        dataToSubmit
      );

      console.log(response);
      setMessage('User updated successfully!');
      setMessageType('success');

      // Optionally reset form data after successful update
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        work_email: '',
        organization: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        youtube_url: '',
        facebook_url: '',
        linkden_url: '',
        twitter_url: '',
        user_image: null,
      });

      // Redirect to user list page after successful update
      navigate('/data');
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error: Could not update user data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-form-c">
      <div className="qr-form-container">
        <button className='all-user-btn' onClick={() => navigate('/data')}>All users</button>
        <h1>Edit User</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className="qr-form" onSubmit={handleFormSubmit}>
            <div className="form-inputs-flex">
              <div className="left-side-form">
                  
              <div className="zip-flex-conm" style={{display:'flex',gap:"10px"}}>
              <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
            </div>
            <div className="zip-flex-conm" style={{display:'flex',gap:"10px"}}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="work_email"
              placeholder="Work Email"
              value={formData.work_email}
              onChange={handleInputChange}
            />
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
                <div className="zip-flex-conm" style={{display:'flex',gap:"10px"}}>
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={addr.street}
              onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={addr.city}
              onChange={handleInputChange}
                  
                />
                </div>
                <div className="zip-flex-conme" style={{display:'flex',gap:"10px"}}>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={addr.state}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP"
                  value={addr.zip}
                  onChange={handleInputChange}
                />
              
                </div>
                <input
                  type="file"
                  name="user_image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <br />
                {formData.user_image && <img src={formData.user_image} width="100px" style={{borderRadius:"50%"}} alt="User" />}
              </div>
              <div className="right-side-form">
                <input
                  type="text"
                  name="organization"
                  placeholder="Organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="url"
                  name="youtube_url"
                  placeholder="YouTube URL"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="facebook_url"
                  placeholder="Facebook URL"
                  value={formData.facebook_url}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="linkden_url"
                  placeholder="LinkedIn URL"
                  value={formData.linkden_url}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="twitter_url"
                  placeholder="Twitter URL"
                  value={formData.twitter_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button className="submit-btn" type="submit">Update</button>
            {message && (
              <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
export default EditQRForm;


