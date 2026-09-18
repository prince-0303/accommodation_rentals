import React, { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../api/usersApi';
import { useAuth } from '../hooks/useAuth';
import { Shield, ShieldOff, CheckCircle, XCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    if (userId === currentUser?.id) return;
    
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'make this user an Admin' : 'remove Admin privileges from this user';
    
    if (!window.confirm(`Are you sure you want to ${actionText}?`)) return;

    try {
      await updateUser(userId, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Failed to update role', error);
      toast.error('Failed to update user role');
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    if (userId === currentUser?.id) return;

    const newStatus = !currentStatus;
    const actionText = newStatus ? 'reactivate this user' : 'deactivate this user';

    if (!window.confirm(`Are you sure you want to ${actionText}?`)) return;

    try {
      await updateUser(userId, { is_active: newStatus });
      toast.success(`User has been ${newStatus ? 'reactivated' : 'deactivated'}`);
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update user status');
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
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            View all platform users, manage roles, and activate or deactivate accounts.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isCurrentUser = user.id === currentUser?.id;
                  const rowOpacity = !user.is_active ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50';

                  return (
                    <tr key={user.id} className={`${rowOpacity}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-bold">{user.username.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {user.username}
                              {isCurrentUser && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.date_joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Shield className="w-3 h-3 mr-1" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Users className="w-3 h-3 mr-1" /> User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleRoleChange(user.id, user.role)}
                            disabled={isCurrentUser}
                            className={`${isCurrentUser ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-900'} flex items-center`}
                            title={isCurrentUser ? "Cannot change your own role" : "Toggle Role"}
                          >
                            {user.role === 'admin' ? <ShieldOff className="w-4 h-4 mr-1" /> : <Shield className="w-4 h-4 mr-1" />}
                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(user.id, user.is_active)}
                            disabled={isCurrentUser}
                            className={`${isCurrentUser ? 'text-gray-400 cursor-not-allowed' : (user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900')} flex items-center`}
                            title={isCurrentUser ? "Cannot change your own status" : "Toggle Status"}
                          >
                            {user.is_active ? <XCircle className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                            {user.is_active ? 'Deactivate' : 'Reactivate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserListPage;
