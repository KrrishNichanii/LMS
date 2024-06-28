import axios from 'axios'

// const BASE_URL = 'http://localhost:8000/api/v1';
const BASE_URL = 'https://lms-backend-6fh8.onrender.com/';

const axiosInstance = axios.create() ;

axiosInstance.defaults.baseURL = BASE_URL ;

axiosInstance.defaults.withCredentials = true ; 


export default axiosInstance ; 
