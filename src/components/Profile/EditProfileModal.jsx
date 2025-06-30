import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { Input } from '../Input';
import { Button } from '../Button';
import { LoadingSpinner } from '../LoadingSpinner';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updatedUser = await api.put(`/users/${user.id}`, formData);
      setUser(updatedUser);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Your Bio"
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 