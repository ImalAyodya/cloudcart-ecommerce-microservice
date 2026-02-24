import { useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sample order data
  const orders = [
    {
      id: "ORD-001",
      user: { name: "John Doe", email: "john@example.com" },
      products: [
        { name: "Wireless Headphones", qty: 1, price: 79.99 },
        { name: "Phone Case", qty: 2, price: 19.99 },
      ],
      total: 119.97,
      status: "Completed",
      payment: "Paid",
      date: "2026-02-24",
    },
    {
      id: "ORD-002",
      user: { name: "Jane Smith", email: "jane@example.com" },
      products: [
        { name: "Smart Watch Pro", qty: 1, price: 199.99 },
      ],
      total: 199.99,
      status: "Processing",
      payment: "Paid",
      date: "2026-02-24",
    },
    {
      id: "ORD-003",
      user: { name: "Bob Wilson", email: "bob@example.com" },
      products: [
        { name: "Laptop Stand", qty: 1, price: 49.99 },
        { name: "Wireless Mouse", qty: 1, price: 34.99 },
        { name: "USB Hub", qty: 1, price: 24.99 },
      ],
      total: 109.97,
      status: "Pending",
      payment: "Pending",
      date: "2026-02-23",
    },
    {
      id: "ORD-004",
      user: { name: "Alice Brown", email: "alice@example.com" },
      products: [
        { name: "Running Shoes", qty: 1, price: 129.99 },
      ],
      total: 129.99,
      status: "Shipped",
      payment: "Paid",
      date: "2026-02-23",
    },
    {
      id: "ORD-005",
      user: { name: "Charlie Davis", email: "charlie@example.com" },
      products: [
        { name: "Fitness Tracker", qty: 2, price: 49.99 },
      ],
      total: 99.98,
      status: "Delivered",
      payment: "Paid",
      date: "2026-02-22",
    },
    {
      id: "ORD-006",
      user: { name: "Diana Lee", email: "diana@example.com" },
      products: [
        { name: "Premium Wallet", qty: 1, price: 59.99 },
      ],
      total: 59.99,
      status: "Cancelled",
      payment: "Refunded",
      date: "2026-02-21",
    },
  ];

  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Completed", "Cancelled"];

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "All" || order.status === statusFilter) &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const endpoints = [
    { method: "POST", path: "/orders", description: "Create new order" },
    { method: "GET", path: "/orders/{id}", description: "Get order details" },
    { method: "GET", path: "/orders/user/{userId}", description: "Get user orders" },
  ];

  const serviceFlow = [
    { step: 1, service: "User Service", action: "Validate user", endpoint: "GET /users/validate/{userId}" },
    { step: 2, service: "Product Service", action: "Check availability", endpoint: "GET /products/{id}/availability" },
    { step: 3, service: "Payment Service", action: "Process payment", endpoint: "POST /payments/process" },
    { step: 4, service: "Product Service", action: "Reduce stock", endpoint: "POST /products/{id}/reduce-stock" },
  ];

  return (
    <div>
      <AdminHeader title="Order Management" />

      <div className="p-6">
        {/* Service Info Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold">Order Service</h2>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">CORE SERVICE</span>
              </div>
              <p className="text-purple-100">The central service that orchestrates all other microservices</p>
              
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{orders.length}</p>
              <p className="text-purple-200">Total Orders</p>
            </div>
          </div>
        </div>

       

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {statuses.slice(1).map((status) => (
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
              <p className="text-2xl font-bold text-slate-800">
                {orders.filter(o => o.status === status).length}
              </p>
              <p className="text-sm text-slate-500">{status}</p>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Link
            to="/admin/orders/create"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Order
          </Link>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Order ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Products</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Total</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Payment</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-semibold text-purple-600">{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-800">{order.user.name}</p>
                        <p className="text-sm text-slate-500">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600">
                        {order.products.slice(0, 2).map((p, idx) => (
                          <p key={idx}>{p.name} x{p.qty}</p>
                        ))}
                        {order.products.length > 2 && (
                          <p className="text-slate-400">+{order.products.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        order.status === "Completed" || order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "Processing" || order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                        order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        order.payment === "Paid" ? "bg-emerald-100 text-emerald-700" :
                        order.payment === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">{order.date}</td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
