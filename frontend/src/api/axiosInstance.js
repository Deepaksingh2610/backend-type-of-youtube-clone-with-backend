import axios from 'axios';

const API_BASE_URL = 'https://backend-type-of-youtube-clone-with.onrender.com/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
