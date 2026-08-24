import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api';

const getRoleBadge = (role) => {
  if (role?.toLowerCase() === 'admin') {
    return 'bg-purple-100 text-purple-800 border-purple-200 shadow-sm';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(Array.isArray(data.data) ? data.data : data.data.users || []);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Users</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Manage team members and their roles</p>
          </div>
          {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-indigo-200 transition-colors">
            Add User
          </button> */}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 whitespace-nowrap">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const uId = user.id || user._id;
                    return (
                      <tr key={uId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{uId.toString().slice(-6)}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                        <td className="px-6 py-4 text-slate-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
             <div className="px-6 py-4 text-center text-slate-500 border-t border-slate-200">
              Showing {users.length} of {users.length} users
            </div>
        </div>
      </div>
    </div>
  );
};

export default Users;

