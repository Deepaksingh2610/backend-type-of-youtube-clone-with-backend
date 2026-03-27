import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import VideoCard from '../components/VideoCard';
import { ThumbsUp } from 'lucide-react';

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axiosInstance.get('/likes/videos');
        // The backend returns an array of video objects (already populated if using aggregation correctly)
        // Adjust based on your backend response format
        setVideos(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch liked videos', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, []);

  if (loading) return <div className="p-8 animate-pulse text-accent">Loading liked videos...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <ThumbsUp className="w-8 h-8 text-accent" />
        <h1 className="text-2xl font-bold">Liked Videos</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map(item => {
            // Some backends return { _id, video: { ... } }, others return video direct
            const video = item.video || item;
            return <VideoCard key={video._id} video={video} />
        })}
      </div>

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                <ThumbsUp className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold">No liked videos</h2>
            <p className="text-gray-400">Videos you like will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
