import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Bell, Heart, UserPlus, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/notifications');
        const data = response.data.data;
        setNotifications(data);
        
        if (data.some(n => !n.isRead)) {
          axiosInstance.patch('/notifications/read').catch(console.error);
          window.dispatchEvent(new Event('notificationsRead'));
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await axiosInstance.patch('/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'LIKE': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'SUBSCRIBE': return <UserPlus className="w-5 h-5 text-accent" />;
      case 'COMMENT': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getMessage = (n) => {
    const sender = <span className="font-bold text-white">@{n.sender?.username}</span>;
    switch (n.type) {
      case 'LIKE': return <p>{sender} liked your video <span className="text-accent italic">"{n.video?.title}"</span></p>;
      case 'SUBSCRIBE': return <p>{sender} subscribed to your channel</p>;
      case 'COMMENT': return <p>{sender} commented on your video</p>;
      default: return <p>{sender} interacted with you</p>;
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-accent">Loading notifications...</div>;

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-secondary pb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        {hasUnread && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-bold text-accent hover:underline bg-accent/10 px-4 py-1.5 rounded-full"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <Bell className="w-16 h-16" />
            <p className="text-xl">You're all caught up!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div 
              key={n._id}
              className={`p-4 rounded-xl flex items-center gap-4 border transition-all cursor-pointer ${
                n.isRead ? 'bg-secondary/20 border-transparent hover:bg-secondary/40' : 'bg-accent/5 border-accent/20 hover:bg-accent/10'
              }`}
              onClick={() => n.video && navigate(`/video/${n.video._id}`)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                <img src={n.sender?.avatar} alt={n.sender?.username} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-sm text-gray-300">
                {getMessage(n)}
                <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(n.createdAt))} ago</span>
              </div>
              <div className="p-2 bg-secondary/50 rounded-lg">
                {getIcon(n.type)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
