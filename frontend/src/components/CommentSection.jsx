import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/${videoId}`);
      setComments(response.data.data.docs || []);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/comments/${videoId}`, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/c/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      <h3 className="text-xl font-bold">{comments.length} Comments</h3>
      
      {/* Add Comment */}
      <form onSubmit={handleAddComment} className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0">
          <img src={user?.avatar} alt={user?.username} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <input
            placeholder="Add a comment..."
            className="bg-transparent border-b border-secondary focus:border-accent outline-none py-1 transition-all"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setNewComment('')}>Cancel</Button>
            <Button type="submit" loading={loading} disabled={!newComment.trim()}>Comment</Button>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0">
              <img src={comment.owner?.avatar} alt={comment.owner?.username} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">@{comment.owner?.username}</span>
                <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
              </div>
              <p className="text-sm text-gray-200">{comment.content}</p>
            </div>
            {comment.owner?._id === user?._id && (
              <button 
                onClick={() => handleDeleteComment(comment._id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-secondary rounded-full text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
