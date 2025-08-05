import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      toast.success("Logged out!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;