import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="flex flex-col gap-3 group">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
          {video.duration || '0:00'}
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0">
          <img src={video.owner?.avatar} alt={video.owner?.username} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-1 overflow-hidden">
          <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-accent transition-colors">
            {video.title}
          </h3>
          <div className="flex flex-col text-xs text-gray-400">
            <span className="hover:text-white transition-colors">{video.owner?.fullName}</span>
            <span>{video.views} views • {formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
