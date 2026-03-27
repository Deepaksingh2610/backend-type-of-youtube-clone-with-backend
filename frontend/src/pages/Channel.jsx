import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import Button from '../components/Button';
import { Users, Video, ListMusic, MessageSquare } from 'lucide-react';

const Channel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const charRes = await axiosInstance.get(`/users/c/${username}`);
        setChannel(charRes.data.data);
        
        // Fetch videos for this channel
        const videosRes = await axiosInstance.get(`/videos?userId=${charRes.data.data._id}`);
        setVideos(videosRes.data.data.docs || []);
      } catch (err) {
        console.error('Failed to fetch channel data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [username]);

  if (loading) return <div className="p-8 animate-pulse text-accent">Loading channel...</div>;
  if (!channel) return <div className="p-8 text-center text-red-500">Channel not found.</div>;

  const isOwner = currentUser?._id === channel._id;

  return (
    <div className="flex flex-col gap-6 -mt-4">
      {/* Cover Image */}
      <div className="w-full h-40 sm:h-60 bg-secondary rounded-2xl overflow-hidden relative group">
        <img 
            src={channel.coverImage || 'https://via.placeholder.com/1500x400'} 
            className="w-full h-full object-cover" 
            alt="cover" 
        />
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 px-4 -mt-12 sm:-mt-16 z-10">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background overflow-hidden bg-secondary shadow-xl">
             <img src={channel.avatar} alt={channel.username} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold">{channel.fullName}</h1>
            <div className="flex items-center gap-2 text-gray-400 justify-center sm:justify-start">
                <span>@{channel.username}</span>
                <span>•</span>
                <span>{channel.subscribersCount} subscribers</span>
                <span>•</span>
                <span>{channel.channelsSubscribedToCount} subscribed</span>
            </div>
            {!isOwner && (
                <Button className="mt-2 w-fit mx-auto sm:mx-0">
                    {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-secondary mt-4">
        {[
            { id: 'videos', label: 'Videos', icon: Video },
            { id: 'playlists', label: 'Playlists', icon: ListMusic },
            { id: 'tweets', label: 'Tweets', icon: MessageSquare }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
                    activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
                <tab.icon className="w-5 h-5" />
                <span className="font-bold">{tab.label}</span>
            </button>
        ))}
      </div>

      {/* Content */}
      <div className="py-6">
        {activeTab === 'videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map(video => (
                    <VideoCard key={video._id} video={{...video, owner: channel}} />
                ))}
                {videos.length === 0 && <p className="text-gray-400">No videos uploaded yet.</p>}
            </div>
        )}
        {activeTab === 'playlists' && <p className="text-gray-400 text-center py-20 italic">Playlists feature coming soon...</p>}
        {activeTab === 'tweets' && <p className="text-gray-400 text-center py-20 italic">Tweets feature coming soon...</p>}
      </div>
    </div>
  );
};

export default Channel;
