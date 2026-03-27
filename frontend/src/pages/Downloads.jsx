import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import VideoCard from '../components/VideoCard';
import { Download } from 'lucide-react';

const Downloads = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await axiosInstance.get('/users/downloads');
        setVideos(response.data.data);
      } catch (err) {
        console.error('Failed to fetch downloads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  if (loading) return <div className="p-8 animate-pulse text-accent">Loading downloads...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-secondary pb-4">
        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
            <Download className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-2xl font-bold">Offline Downloads</h1>
            <p className="text-gray-400 text-sm">Videos you've saved to watch anytime</p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Download className="w-16 h-16 text-gray-600" />
            <p className="text-xl text-gray-400">No downloads yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
