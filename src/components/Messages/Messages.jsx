import React, { useState } from 'react';
import { Send, Search, Phone, Video, Info, Image as ImageIcon, Smile } from 'lucide-react';
import { Input } from '../Input';

export function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  // Dummy data for demonstration
  const chats = [
    { id: 1, name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe', lastMessage: 'Hey, how are you?', time: '2m ago', unread: 2 },
    { id: 2, name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith', lastMessage: 'The project looks great!', time: '1h ago', unread: 0 },
    { id: 3, name: 'Mike Johnson', avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson', lastMessage: 'See you tomorrow!', time: '2h ago', unread: 1 },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add logic to send message
      setMessage('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-5rem)] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
      {/* Chat List */}
      <div className="col-span-1 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <Input
            placeholder="Search messages"
            leftIcon={<Search className="text-gray-400" size={18} />}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
            >
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{chat.name}</h3>
                  <span className="text-sm text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {chat.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-span-2 lg:col-span-3 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full" />
                <h2 className="font-semibold text-gray-900 dark:text-white">{selectedChat.name}</h2>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Phone size={20} />
                </button>
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Video size={20} />
                </button>
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Info size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Add messages here */}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <button type="button" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <ImageIcon size={20} />
                </button>
                <button type="button" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Smile size={20} />
                </button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}