import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    let res = await fetch("http://localhost:5500/api/v10/users/logout", {
      method: "POST",
      credentials: "include",
    });
    res = await res.json();
    if (res.success) {
      navigate("/login");
    }
  };

  const linkClass = (path) =>
    `px-4 py-2 rounded ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* Left */}
      <h1 className="text-xl font-bold text-blue-600">Furniture CRM</h1>

      {/* Center Links */}
      <div className="flex gap-3">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/customers" className={linkClass("/customers")}>
          Customers
        </Link>
      </div>

      {/* Right */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
