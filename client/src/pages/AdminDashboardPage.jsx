import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
        setStats(data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []); // The empty array ensures this runs only once when the component mounts

  if (loading) {
    return <div className="text-center p-8">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard 📊</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold text-blue-800">Total Users</h2>
            <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold text-green-800">Total Places</h2>
            <p className="text-4xl font-bold mt-2">{stats.totalPlace}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold text-yellow-800">Total Bookings</h2>
            <p className="text-4xl font-bold mt-2">{stats.totalBookings}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;