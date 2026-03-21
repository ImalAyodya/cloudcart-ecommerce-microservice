import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ChevronRight,
  Loader2,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { getOrdersByUser } from "../services/orderService";

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

const MyOrdersPage = () => {
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const userId = user?._id || user?.id || user?.email || "";

  const fetchOrders = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const data = await getOrdersByUser(userId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Package className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">Sign in to view your orders</h2>
        <Link
          to="/login"
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-1">My Orders</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/home" className="hover:text-sky-400">Home</Link>
            <span>/</span>
            <span className="text-sky-400">My Orders</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="CREATED">Created</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading your orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
            <Package className="w-14 h-14 text-slate-300 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-slate-800">No orders found</h2>
            <p className="text-sm text-slate-500 mt-1">Place your first order to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/my-orders/${order._id}`)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-sky-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Order Number</p>
                    <p className="font-mono text-sm font-semibold text-slate-800 break-all">
                      {order.OrderNumber || order.orderNumber || order._id}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <p className="text-base font-bold text-slate-800">
                        Total: LKR {Number(order.totalAmount || 0).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass(order.status)}`}>
                          {order.status || "UNKNOWN"}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
