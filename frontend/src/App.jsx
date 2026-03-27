import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'

import Home from './pages/Home'
import VideoDetail from './pages/VideoDetail'
import Channel from './pages/Channel'
import Dashboard from './pages/Dashboard'
import SearchResults from './pages/SearchResults'
import History from './pages/History'
import LikedVideos from './pages/LikedVideos'
import Notifications from './pages/Notifications'
import Downloads from './pages/Downloads'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/video/:videoId" element={<VideoDetail />} />
                  <Route path="/c/:username" element={<Channel />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/liked" element={<LikedVideos />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/downloads" element={<Downloads />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
