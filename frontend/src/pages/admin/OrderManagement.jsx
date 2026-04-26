import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import { getAllOrders, cancelOrder } from "../../services/orderService";

const statusClass = (status) => {
  if (status === "CONFIRMED") return "bg-emerald-100 text-emerald-700";
  if (status === "CREATED") return "bg-amber-100 text-amber-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  if (status === "CANCELLED") return "bg-slate-200 text-slate-700";
  return "bg-slate-100 text-slate-700";
};

const paymentClass = (status) => {
  if (status === "SUCCESS") return "bg-emerald-100 text-emerald-700";
  if (status === "PENDING") return "bg-amber-100 text-amber-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cancelLoadingId, setCancelLoadingId] = useState("");

  const statuses = ["All", "CREATED", "CONFIRMED", "FAILED", "CANCELLED"];

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      const orderNum = (order.OrderNumber || order.orderNumber || order._id || "").toLowerCase();
      const matchesSearch = orderNum.includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  const handleCancelOrder = async (e, orderId) => {
    e.stopPropagation();
    const confirmed = window.confirm("Cancel this order?");
    if (!confirmed) return;

    setCancelLoadingId(orderId);
    try {
      const response = await cancelOrder(orderId);
      const updatedOrder = response?.order || response;
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...updatedOrder } : o))
      );
    } catch (err) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setCancelLoadingId("");
    }
  };

  const statusCounts = useMemo(() => {
    const counts = {};
    statuses.slice(1).forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

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
              <p className="text-purple-100">Manage and monitor all customer orders</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{orders.length}</p>
              <p className="text-purple-200">Total Orders</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statuses.slice(1).map((status) => (
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
              <p className="text-2xl font-bold text-slate-800">{statusCounts[status] || 0}</p>
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
              placeholder="Search by order number..."
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
          <button
            onClick={fetchOrders}
            className="px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-10 flex items-center justify-center gap-3 text-slate-500">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <p className="text-lg font-semibold">No orders found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Order Number</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Products</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Total</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Payment</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Date</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredOrders.map((order) => {
                    const canCancel = order.status === "CREATED" || order.status === "CONFIRMED";
                    return (
                      <tr
                        key={order._id}
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono font-semibold text-purple-600">
                            {order.OrderNumber || order.orderNumber || order._id}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-slate-600">
                            {order.products?.slice(0, 2).map((p, idx) => (
                              <p key={idx}>{p.productName || p.name || "Product"} x{p.quantity}</p>
                            ))}
                            {(order.products?.length || 0) > 2 && (
                              <p className="text-slate-400">+{order.products.length - 2} more</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          LKR {Number(order.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClass(order.status)}`}>
                            {order.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${paymentClass(order.paymentStatus)}`}>
                            {order.paymentStatus || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-sm">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/orders/${order._id}`);
                              }}
                              className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                            >
                              View
                            </button>
                            {canCancel && (
                              <button
                                onClick={(e) => handleCancelOrder(e, order._id)}
                                disabled={cancelLoadingId === order._id}
                                className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                              >
                                {cancelLoadingId === order._id ? "Cancelling..." : "Cancel"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
