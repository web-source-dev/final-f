import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const QRForm = () => {
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
    zipcode: '',
    youtube_url: '',
    facebook_url: '',
    linkden_url: '',
    twitter_url: '',
    user_image: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [namedata, setNamedata] = useState('');

  // Cloudinary credentials directly set in code
  const cloudName = 'dcvqytwuq';
  const uploadPreset = 'my_qr_preset';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
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
  
    // Prepare the form data
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', uploadPreset);
    uploadData.append('cloud_name', cloudName);
  
    try {
        const response = await axios.post(https://api.cloudinary.com/v1_1/${cloudName}/image/upload, uploadData);
  
        if (response.status === 200) {
            const imageUrl = response.data.secure_url;
            setFormData((prev) => ({ ...prev, user_image: imageUrl }));
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        setMessage('Error uploading image. Please try again.');
        setMessageType('error');
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
       const response = await axios.post('https://final-b-red.vercel.app/api/qrdata', formData, {
  headers: {
    'Content-Type': 'application/json', // Ensure this matches the backend expectation
  }
});
        if (response.status === 201) {
            const { userId, qrdata } = response.data;
            setUserId(userId);
            setIsSubmitted(true);
            setMessage('Form submitted successfully!');
            setMessageType('success');
            setNamedata(qrdata);
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
                zipcode: '',
                youtube_url: '',
                facebook_url: '',
                linkden_url: '',
                twitter_url: '',
                user_image: null, // Reset image field after submission
            });
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        setMessage('Error: Please check the data.');
        setMessageType('error');
    }
  };

  const downloadQRCode = () => {
    const canvas = document.createElement('canvas');
    const qrCanvas = document.getElementById('qr-code-canvas');

    if (!qrCanvas) {
      setMessage('QR Code not generated yet. Please submit the form first.');
      setMessageType('error');
      return;
    }

    const qrCodeSize = 300;
    const padding = 50;

    canvas.width = qrCodeSize + padding * 2;
    canvas.height = qrCodeSize + 150;

    const context = canvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.fillText(namedata.name, canvas.width / 2, 30);

    context.drawImage(qrCanvas, padding, 50, qrCodeSize, qrCodeSize);


    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'user-qr-code.png';
    a.click();
  };

  return (
    <div className="center-form-c">
      <div className="qr-form-container">
        <button onClick={() => navigate('/data')}>All users</button>
        <h1>Form Submission</h1>

        {!isSubmitted ? (
          <form className="qr-form" onSubmit={handleFormSubmit}>
            <div className="form-inputs-flex">
              <div className="left-side-form">
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
                  placeholder="Last_Name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
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
                <input
                  type="number"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
                 <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                 <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
                 <input
                  type="text"
                  name="zipcode"
                  placeholder="Zip Code"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  required
                />
              <div className="img-upload-in-form">
              <input
                  type="file"
                  name="user_image"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
              </div>
              {formData.user_image && <img src={formData.user_image} width="80px"height="80px" style={{borderRadius:"50%",marginTop:"30px"}} alt="User" />}
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
            <button className="submit-btn" type="submit">Submit</button>
            {message && (
              <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
                {message}
              </p>
            )}
          </form>
        ) : (
          <div className="form-submitted">
            <div id="qr-code-download" className="qr-code-container">
              <h2>{namedata.name}</h2>
              <QRCodeCanvas
                id="qr-code-canvas"
                value={https://final-f-kohl.vercel.app/user/${userId}}
                size={300}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
            <button onClick={downloadQRCode}>Download QR Code</button>
            <button className="back-red" onClick={() => setIsSubmitted(false)}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRForm;
