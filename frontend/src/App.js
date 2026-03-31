import { useState, useEffect } from "react";
import ToastContainer from "./components/Toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function getInitialAuth() {
  try {
    const token = localStorage.getItem("ft_token");
    const user = localStorage.getItem("ft_user");
    if (token && user) return { token, ...JSON.parse(user) };
  } catch { localStorage.clear(); }
  return null;
}

export default function App() {
  const [auth, setAuth] = useState(getInitialAuth);
  const [page, setPage] = useState(() => getInitialAuth() ? "dashboard" : "home");

  const navigate = (target) => {
    // Guard: block login/register/home if already authenticated
    if (auth && (target === "login" || target === "register")) return setPage("dashboard");
    // Guard: block dashboard if not authenticated
    if (!auth && target === "dashboard") return setPage("login");
    setPage(target);
  };

  const handleLogin = (token, name) => {
    localStorage.setItem("ft_token", token);
    localStorage.setItem("ft_user", JSON.stringify({ name }));
    setAuth({ token, name });
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("ft_token");
    localStorage.removeItem("ft_user");
    setAuth(null);
    setPage("home");
  };

  return (
    <>
      <ToastContainer />
      {page === "home" && <Home onNavigate={navigate} />}
      {page === "login" && <Login onLogin={handleLogin} onNavigate={navigate} />}
      {page === "register" && <Register onNavigate={navigate} />}
      {page === "dashboard" && auth && <Dashboard userName={auth.name} onLogout={handleLogout} />}
    </>
  );
}
