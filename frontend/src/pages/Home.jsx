import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get('/videos');
        // The backend returns videos in a paginate format: response.data.data.docs
        setVideos(response.data.data.docs || []);
      } catch (err) {
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-video bg-secondary rounded-xl animate-pulse"></div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary animate-pulse"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-secondary rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-secondary rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center gap-4">
        <div className="text-red-500 text-xl font-bold">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-accent hover:underline"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center gap-4">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-4xl text-gray-500">📺</span>
        </div>
        <h2 className="text-2xl font-bold">No videos found</h2>
        <p className="text-gray-400">Be the first one to upload a video!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Recommended</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;
