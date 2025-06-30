import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { Button } from '../Button';

const SuggestedUsers = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await api.get('/users/suggestions');
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await api.post(`/users/${userId}/follow`);
      setSuggestions(suggestions.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Suggested For You</h3>
      <div className="space-y-3">
        {suggestions.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
            <Button size="sm" onClick={() => handleFollow(user.id)}>Follow</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers; 