import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, Bell, Share2, MoreHorizontal, Download as DownloadIcon, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import CommentSection from '../components/CommentSection';
import { format } from 'date-fns';

const VideoDetail = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axiosInstance.get(`/videos/${videoId}`);
        setVideo(response.data.data);
        setIsLiked(response.data.data.isLiked);
        setLikesCount(response.data.data.likesCount);
        setIsSubscribed(response.data.data.owner?.isSubscribed);
        setSubscribersCount(response.data.data.owner?.subscribersCount || 0);
        
        // Check if already downloaded
        const userResponse = await axiosInstance.get('/users/downloads');
        const downloadedIds = userResponse.data.data.map(v => v._id);
        setIsDownloaded(downloadedIds.includes(videoId));
      } catch (err) {
        console.error('Failed to fetch video', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleLikeToggle = async () => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      setIsLiked(response.data.data.isLiked);
      setLikesCount(response.data.data.likesCount);
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  };

  const handleSubscribeToggle = async () => {
    try {
      if (!video.owner?._id) return;
      const response = await axiosInstance.post(`/subscriptions/c/${video.owner?._id}`);
      setIsSubscribed(response.data.data.isSubscribed);
      setSubscribersCount(response.data.data.subscribersCount);
    } catch (err) {
      console.error('Subscribe toggle failed', err);
    }
  };

  const handleDownloadToggle = async () => {
    try {
      const response = await axiosInstance.post(`/users/toggle-download/${videoId}`);
      setIsDownloaded(response.data.data.isDownloaded);
    } catch (err) {
      console.error('Download toggle failed', err);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-accent">Loading video...</div>;
  if (!video) return <div className="p-8 text-center text-red-500">Video not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Content */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Player */}
        <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video 
            src={video.videoFile} 
            controls 
            autoPlay 
            className="w-full h-full"
          />
        </div>

        {/* Info */}
        <h1 className="text-2xl font-bold mt-2">{video.title}</h1>
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-secondary pb-4">
          <div className="flex items-center gap-4">
             <div onClick={() => window.location.href = `/c/${video.owner?.username}`} className="w-12 h-12 rounded-full bg-secondary overflow-hidden border border-accent/20 cursor-pointer">
                <img src={video.owner?.avatar} alt={video.owner?.username} className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-lg">{video.owner?.fullName}</span>
                <span className="text-xs text-gray-400">{subscribersCount} subscribers</span>
             </div>
             {video.owner?._id !== user?._id && (
                <Button 
                    variant={isSubscribed ? "secondary" : "primary"}
                    onClick={handleSubscribeToggle}
                    className="ml-4"
                >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
             )}
          </div>

          <div className="flex items-center gap-2">
            <button 
                onClick={handleDownloadToggle}
                className={`flex items-center gap-3 px-6 py-2 rounded-full bg-secondary hover:bg-white/10 border border-white/5 transition-all ${isDownloaded ? 'text-green-500 bg-green-500/10 border-green-500/20' : ''}`}
            >
                {isDownloaded ? <CheckCircle className="w-5 h-5" /> : <DownloadIcon className="w-5 h-5" />}
                <span className="font-bold hidden sm:block">{isDownloaded ? "Saved" : "Download"}</span>
            </button>
            <div className="flex items-center bg-secondary rounded-full overflow-hidden">
                <button 
                    onClick={handleLikeToggle}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition-all ${isLiked ? 'text-accent' : ''}`}
                >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-accent' : ''}`} />
                    <span className="font-bold">{likesCount}</span>
                </button>
                <div className="w-[1px] h-6 bg-gray-600/50"></div>
                <button className="px-4 py-2 hover:bg-white/10 transition-all text-gray-400">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
            <button className="p-2 bg-secondary rounded-full hover:bg-white/10 transition-all">
                <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-secondary/40 p-4 rounded-xl text-sm text-gray-300">
            <div className="flex gap-2 font-bold text-white mb-2">
                <span>{video.views} views</span>
                <span>{video.createdAt && format(new Date(video.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <p className="whitespace-pre-wrap">{video.description}</p>
        </div>

        {/* Comments */}
        <CommentSection videoId={videoId} />
      </div>

      {/* Right Content (Sidebar - Recommended Videos) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Next Videos</h2>
        <div className="flex flex-col gap-4">
            {/* We can fetch and map recommendations here */}
            <div className="flex gap-3 animate-pulse">
                <div className="w-40 h-24 bg-secondary rounded-lg shrink-0"></div>
                <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-secondary rounded w-full"></div>
                    <div className="h-3 bg-secondary rounded w-2/3"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
