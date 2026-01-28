import axios from "axios";

const BASE_URL = import.meta.env.BASE_URL;

export const axiosInstance = axios.create({
    baseURL:BASE_URL,
});

export const getToken = () => localStorage.getItem("token");

export const authHeader = ()=>({
    Authorization:`Bearer ${getToken()}`
})

