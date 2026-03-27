import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import VideoCard from '../components/VideoCard';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get('/users/history');
        setVideos(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 animate-pulse text-accent">Loading history...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <HistoryIcon className="w-8 h-8 text-accent" />
        <h1 className="text-2xl font-bold">Watch History</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                <HistoryIcon className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold">No watch history</h2>
            <p className="text-gray-400">Videos you watch will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default History;
