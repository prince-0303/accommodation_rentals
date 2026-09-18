import React, { useState, useEffect } from 'react';
import { getProperties } from '../api/propertiesApi';
import { getBookings } from '../api/bookingsApi';
import { getUsers } from '../api/usersApi';
import { Building, Bookmark, CheckCircle, XCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    properties: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [propertiesRes, bookingsRes, usersRes] = await Promise.all([
        getProperties(),
        getBookings(),
        getUsers()
      ]);

      const confirmed = bookingsRes.filter(b => b.status === 'confirmed').length;
      const cancelled = bookingsRes.filter(b => b.status === 'cancelled').length;

      setStats({
        properties: propertiesRes.length,
        totalBookings: bookingsRes.length,
        confirmedBookings: confirmed,
        cancelledBookings: cancelled,
        users: usersRes.length
      });
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Properties</p>
            <p className="text-2xl font-bold text-gray-900">{stats.properties}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="rounded-full bg-indigo-100 p-3 mr-4">
            <Bookmark className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.confirmedBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold text-gray-900">{stats.cancelledBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
