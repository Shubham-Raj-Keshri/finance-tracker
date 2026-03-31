import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use(req => {
  const token = localStorage.getItem("ft_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ft_token");
      localStorage.removeItem("ft_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
