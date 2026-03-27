import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Eye, Heart, User, Video, Plus } from 'lucide-react';
import VideoUpload from '../components/VideoUpload';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-secondary/40 border border-secondary p-6 rounded-2xl flex items-center gap-4">
    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-accent" />
    </div>
    <div className="flex flex-col">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-2xl font-bold">{value}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, videosRes] = await Promise.all([
        axiosInstance.get('/dashboard/stats'),
        axiosInstance.get('/dashboard/videos')
      ]);
      setStats(statsRes.data.data);
      setVideos(videosRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-accent animate-pulse">Loading dashboard...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.fullName}</h1>
            <p className="text-gray-400">Here's what's happening on your channel</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            Upload Video
        </Button>
      </div>

      <VideoUpload 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={fetchDashboardData}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Eye} label="Total Views" value={stats?.totalViews || 0} />
        <StatCard icon={User} label="Subscribers" value={stats?.totalSubscribers || 0} />
        <StatCard icon={Video} label="Total Videos" value={stats?.totalVideos || 0} />
        <StatCard icon={Heart} label="Total Likes" value={stats?.totalLikes || 0} />
      </div>

      {/* Video Management */}
      <div className="bg-secondary/20 border border-secondary rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-secondary">
            <h2 className="text-xl font-bold">Manage Videos</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-secondary/40 text-gray-400 text-sm">
                    <tr>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Video</th>
                        <th className="px-6 py-4 font-medium">Date Uploaded</th>
                        <th className="px-6 py-4 font-medium">Views</th>
                        <th className="px-6 py-4 font-medium">Likes</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-secondary">
                    {videos.map(video => (
                        <tr key={video._id} className="hover:bg-white/5 transition-all">
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold border border-green-500/20">
                                    Published
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-20 h-12 bg-secondary rounded overflow-hidden flex-shrink-0">
                                        <img src={video.thumbnail} className="w-full h-full object-cover" alt="thumbnail" />
                                    </div>
                                    <span className="font-medium text-sm line-clamp-1">{video.title}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">
                                {new Date(video.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm">{video.views}</td>
                            <td className="px-6 py-4 text-sm">0</td>
                            <td className="px-6 py-4 text-right">
                                <Button variant="ghost" className="p-2 h-auto text-xs font-normal">Edit</Button>
                                <Button variant="ghost" className="p-2 h-auto text-xs font-normal text-red-500">Delete</Button>
                            </td>
                        </tr>
                    ))}
                    {videos.length === 0 && (
                        <tr>
                            <td colSpan="6" className="px-6 py-20 text-center text-gray-400">
                                You haven't uploaded any videos yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
