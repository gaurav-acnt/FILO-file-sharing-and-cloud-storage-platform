import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL ||
  "https://filo-backend-production.up.railway.app"; 

export const axiosInstance = axios.create({
    baseURL:BASE_URL,
});

export const getToken = () => localStorage.getItem("token");

export const authHeader = ()=>({
    Authorization:`Bearer ${getToken()}`
})

