import { useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample user data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active", createdAt: "2026-01-15", orders: 12 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Customer", status: "Active", createdAt: "2026-01-20", orders: 8 },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Admin", status: "Active", createdAt: "2026-01-10", orders: 0 },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Inactive", createdAt: "2026-02-01", orders: 3 },
    { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "Customer", status: "Active", createdAt: "2026-02-10", orders: 15 },
    { id: 6, name: "Diana Lee", email: "diana@example.com", role: "Customer", status: "Active", createdAt: "2026-02-15", orders: 6 },
    { id: 7, name: "Edward King", email: "edward@example.com", role: "Customer", status: "Suspended", createdAt: "2026-02-18", orders: 1 },
    { id: 8, name: "Fiona Green", email: "fiona@example.com", role: "Customer", status: "Active", createdAt: "2026-02-20", orders: 9 },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const endpoints = [
    { method: "POST", path: "/users/register", description: "Register new user" },
    { method: "POST", path: "/users/login", description: "Login user" },
    { method: "GET", path: "/users/{id}", description: "Get user details" },
    { method: "GET", path: "/users/validate/{id}", description: "Validate user (used by Order Service)" },
  ];

  return (
    <div>
      <AdminHeader title="User Management" />

      <div className="p-6">
        {/* Service Info Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">User Service</h2>
              <p className="text-blue-100">Handles user registration, authentication, and profile management</p>
             
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-blue-200">Total Users</p>
            </div>
          </div>
        </div>

       

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Link
            to="/admin/users/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New User
          </Link>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Orders</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        user.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                        user.status === "Inactive" ? "bg-slate-100 text-slate-600" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{user.orders}</td>
                    <td className="py-4 px-6 text-slate-500 text-sm">{user.createdAt}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/admin/users/${user.id}/edit`}
                          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">2</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
