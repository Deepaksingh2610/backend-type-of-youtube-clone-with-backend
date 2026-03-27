import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { X, Upload, Film, Image as ImageIcon } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const VideoUpload = ({ isOpen, onClose, onUploadSuccess }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [files, setFiles] = useState({ videoFile: null, thumbnail: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e, type) => {
    setFiles({ ...files, [type]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!files.videoFile || !files.thumbnail) {
        return setError('Both video and thumbnail are required');
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('videoFile', files.videoFile);
    data.append('thumbnail', files.thumbnail);

    try {
      await axiosInstance.post('/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-background border border-secondary w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-secondary flex items-center justify-between">
          <h2 className="text-xl font-bold">Upload Video</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
                <Input
                    label="Title"
                    placeholder="Enter video title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        placeholder="Tell viewers about your video"
                        className="bg-secondary border border-transparent focus:border-accent rounded-lg py-2.5 px-4 outline-none transition-all placeholder:text-gray-500 text-white min-h-[120px] resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Video File */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Video File *</label>
                    <div 
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-accent bg-secondary/20 ${files.videoFile ? 'border-accent text-accent' : 'border-secondary'}`}
                        onClick={() => document.getElementById('video-input').click()}
                    >
                        <Film className="w-8 h-8 opacity-50" />
                        <span className="text-xs text-center line-clamp-1">
                            {files.videoFile ? files.videoFile.name : 'Select or drop video file'}
                        </span>
                        <input id="video-input" type="file" hidden accept="video/*" onChange={(e) => handleFileChange(e, 'videoFile')} />
                    </div>
                </div>

                {/* Thumbnail */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Thumbnail *</label>
                    <div 
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-accent bg-secondary/20 ${files.thumbnail ? 'border-accent text-accent' : 'border-secondary'}`}
                        onClick={() => document.getElementById('thumb-input').click()}
                    >
                        <ImageIcon className="w-8 h-8 opacity-50" />
                        <span className="text-xs text-center line-clamp-1">
                            {files.thumbnail ? files.thumbnail.name : 'Select or drop thumbnail'}
                        </span>
                        <input id="thumb-input" type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} />
                    </div>
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading} className="px-10">Upload Video</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload;
