import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axiosInstance from '../api/axiosInstance';
import { Upload } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previews, setPreviews] = useState({ avatar: '', coverImage: '' });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'avatar') {
        setAvatar(file);
      } else {
        setCoverImage(file);
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviews({ ...previews, [type]: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }
    setOtpLoading(true);
    setError("");
    try {
      await axiosInstance.post("/otp/send-otp", { email: formData.email });
      setIsOtpSent(true);
      alert("OTP sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setOtpLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/otp/verify-otp", { 
        email: formData.email, 
        otp 
      });
      if (response.data.data.verified) {
        setIsVerified(true);
        alert("Email verified successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      setError("Please verify your email first");
      return;
    }
    if (!avatar) {
      setError("Avatar is required");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("avatar", avatar);
    if (coverImage) data.append("coverImage", coverImage);

    try {
      await axiosInstance.post("/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-[100] px-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-secondary/50 backdrop-blur-xl border border-secondary p-8 rounded-2xl flex flex-col gap-6 my-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold italic">Join videoadda</h1>
          <p className="text-gray-400">Share your videos with the world</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 flex flex-col gap-4">
            <h2 className="text-lg font-semibold border-b border-secondary pb-2 mb-2">Account Info</h2>
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-secondary border border-secondary p-2 rounded-lg outline-none focus:border-accent disabled:opacity-50"
                  value={formData.email}
                  disabled={isOtpSent}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                {!isVerified && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="whitespace-nowrap h-[42px]"
                    onClick={handleSendOtp}
                    loading={otpLoading && !isOtpSent}
                    disabled={isOtpSent}
                  >
                    {isOtpSent ? "Sent" : "Send OTP"}
                  </Button>
                )}
              </div>
            </div>

            {isOtpSent && !isVerified && (
              <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-gray-300">Enter OTP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="6-digit code"
                    className="flex-1 bg-secondary border border-secondary p-2 rounded-lg outline-none focus:border-accent"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={handleVerifyOtp}
                    loading={otpLoading}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            )}

            {isVerified && (
              <div className="text-sm text-green-500 flex items-center gap-2 font-medium bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                 ✓ Email Verified Successfully
              </div>
            )}

            <Input
              label="Username"
              placeholder="Pick a username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-6">
            {/* Avatar Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 text-center">Profile Image *</label>
              <div 
                className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-secondary group hover:border-accent transition-all cursor-pointer relative overflow-hidden flex items-center justify-center bg-secondary/30"
                onClick={() => document.getElementById('avatar-input').click()}
              >
                {previews.avatar ? (
                  <img src={previews.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-500 group-hover:text-accent" />
                )}
                <input id="avatar-input" type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 text-center">Cover Image (Optional)</label>
              <div 
                className="w-full h-24 rounded-xl border-2 border-dashed border-secondary group hover:border-accent transition-all cursor-pointer relative overflow-hidden flex items-center justify-center bg-secondary/30"
                onClick={() => document.getElementById('cover-input').click()}
              >
                {previews.coverImage ? (
                  <img src={previews.coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-500 group-hover:text-accent" />
                )}
                <input id="cover-input" type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} />
              </div>
            </div>
            
            <Button 
              type="submit" 
              loading={loading} 
              className="w-full mt-auto"
              disabled={!isVerified}
            >
              Create Account
            </Button>
          </div>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-accent hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
