import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import VideoCard from '../components/VideoCard';
import { Search as SearchIcon } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/videos?query=${query}`);
        setVideos(response.data.data.docs || []);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  if (loading) return <div className="p-8 animate-pulse text-accent">Searching for "{query}"...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl text-gray-400">
        Search results for <span className="text-white font-bold">"{query}"</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SearchIcon className="w-16 h-16 text-gray-600" />
            <div className="text-center">
                <h2 className="text-2xl font-bold">No results found</h2>
                <p className="text-gray-400">Try different keywords or check your spelling</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
