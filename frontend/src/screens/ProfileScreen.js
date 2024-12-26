import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Button, Card, Row, Col, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';
import './ProfileScreen.css'; // Import custom CSS

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // New states for profile picture
  const [image, setImage] = useState(userInfo.image || ''); // Assuming userInfo has an image property
  const [imagePreview, setImagePreview] = useState(userInfo.image || '');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  // Handler for image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }
      setImage(file);
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      // Prepare form data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (password) formData.append('password', password);
      if (image) formData.append('image', image);

      const { data } = await axios.put('/api/users/profile', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}` 
        },
      });

      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' }); // Corrected action type
      toast.error(getError(err));
    }
  };

  return (
    <div className="container mt-5">
      <Helmet>
        <title>Kullanıcı</title>
      </Helmet>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">User Profile</h2>
            <Form onSubmit={submitHandler}>
              {/* Profile Picture Section */}
              <div className="text-center mb-4 position-relative">
                <img
                  src={imagePreview || 'https://via.placeholder.com/150'}
                  alt="Profile Preview"
                  className="profile-image mb-2"
                />
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Change Profile Picture</Tooltip>}
                >
                  <label htmlFor="image-upload" className="upload-button">
                    <FaCamera />
                  </label>
                </OverlayTrigger>
                <Form.Control
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Name Input */}
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-pill"
                />
              </Form.Group>

              {/* Email Input */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-pill"
                />
              </Form.Group>

              {/* Password Input */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Leave blank to keep current password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-pill"
                />
              </Form.Group>

              {/* Confirm Password Input */}
              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Leave blank to keep current password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-pill"
                />
              </Form.Group>

              {/* Submit Button */}
              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loadingUpdate} className="rounded-pill">
                  {loadingUpdate ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
