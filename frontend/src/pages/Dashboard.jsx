import React, { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStats = async () => {
    try {
      let res = await fetch("http://localhost:5500/api/v10/orders/dashboard", {
        method: "GET",
        credentials: "include",
      });
      res = await res.json();
      if (res.success) {
        setStats(res.data);
        console.log(res.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);
  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Total Customers</p>
          <h2 className="text-2xl font-bold">{stats.totalCustomers}</h2>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold">{stats.totalOrders}</h2>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold">₹ {stats.totalRevenue}</h2>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Pending Orders</p>
          <h2 className="text-2xl font-bold">{stats.pendingOrders}</h2>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Completed Orders</p>
          <h2 className="text-2xl font-bold">{stats.completeOrders}</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
