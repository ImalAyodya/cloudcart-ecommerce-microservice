import { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import { getAllUsers } from "../../services/userService";
import { getAllProducts, getProductStats } from "../../services/productService";
import { getAllOrders } from "../../services/orderService";

const formatLkr = (value) => {
  const numericValue = Number(value || 0);
  return `LKR ${numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatOrderStatus = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "CONFIRMED") return "Completed";
  if (normalized === "CREATED") return "Processing";
  if (normalized === "FAILED") return "Failed";
  if (normalized === "CANCELLED") return "Cancelled";
  return normalized || "Unknown";
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      const [usersResult, productsResult, statsResult, ordersResult] =
        await Promise.allSettled([
          getAllUsers(),
          getAllProducts(),
          getProductStats(),
          getAllOrders(),
        ]);

      if (usersResult.status === "fulfilled") {
        setUsersCount(Array.isArray(usersResult.value) ? usersResult.value.length : 0);
      }

      if (productsResult.status === "fulfilled") {
        const products = Array.isArray(productsResult.value?.products)
          ? productsResult.value.products
          : [];
        setProductsCount(products.length);
      }

      if (statsResult.status === "fulfilled") {
        const totalFromStats = Number(statsResult.value?.total);
        if (!Number.isNaN(totalFromStats) && totalFromStats > 0) {
          setProductsCount(totalFromStats);
        }
      }

      if (ordersResult.status === "fulfilled") {
        const orders = Array.isArray(ordersResult.value) ? ordersResult.value : [];
        setOrdersCount(orders.length);

        const confirmedPayments = orders.filter(
          (order) => String(order?.paymentStatus || "").toUpperCase() === "SUCCESS"
        );

        const totalRevenue = confirmedPayments.reduce(
          (sum, order) => sum + Number(order?.totalAmount || 0),
          0
        );

        setPaymentsTotal(totalRevenue);

        setRecentOrders(
          orders.slice(0, 5).map((order) => ({
            id: order?.OrderNumber || order?.OrderId || order?._id || "N/A",
            user: order?.userId || "N/A",
            amount: formatLkr(order?.totalAmount || 0),
            status: formatOrderStatus(order?.status),
            date: order?.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-CA")
              : "N/A",
          }))
        );
      }

      const failedServices = [usersResult, productsResult, statsResult, ordersResult].filter(
        (result) => result.status === "rejected"
      );

      if (failedServices.length > 0) {
        setError("Some dashboard data could not be loaded. Showing available data.");
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: usersCount.toLocaleString("en-US"),
      change: "Live",
      changeType: "neutral",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "bg-blue-500",
      service: "User Service",
      owner: "Imal",
    },
    {
      title: "Total Products",
      value: productsCount.toLocaleString("en-US"),
      change: "Live",
      changeType: "neutral",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "bg-emerald-500",
      service: "Product Service",
      owner: "Sithmaka",
    },
    {
      title: "Total Orders",
      value: ordersCount.toLocaleString("en-US"),
      change: "Live",
      changeType: "neutral",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "bg-purple-500",
      service: "Order Service",
      owner: "Malmi",
    },
    {
      title: "Total Payments",
      value: formatLkr(paymentsTotal),
      change: "Live",
      changeType: "neutral",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-orange-500",
      service: "Payment Service",
      owner: "Pasan",
    },
  ];

  return (
    <div>
      <AdminHeader title="Dashboard" />
      
      <div className="p-6">
        {error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-emerald-600"
                    : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-slate-500"
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-slate-500 text-sm">{stat.title}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{stat.service}</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">{stat.owner}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
              <p className="text-sm text-slate-500">Latest orders from Order Service (Malmi)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Order ID</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">User</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-8 px-6 text-center text-sm text-slate-500">
                        Loading dashboard data...
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 px-6 text-center text-sm text-slate-500">
                        No orders available.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="py-3 px-6 text-sm font-medium text-slate-800">{order.id}</td>
                        <td className="py-3 px-6 text-sm text-slate-600">{order.user}</td>
                        <td className="py-3 px-6 text-sm text-slate-600">{order.amount}</td>
                        <td className="py-3 px-6">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            order.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Failed"
                              ? "bg-red-100 text-red-700"
                              : order.status === "Cancelled"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders Quick View */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Recent Orders Overview</h2>
              <p className="text-sm text-slate-500">Compact list view using the same latest orders data</p>
            </div>

            <div className="p-6">
              {loading ? (
                <p className="text-sm text-slate-500">Loading recent orders...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-sm text-slate-500">No recent orders to show.</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={`quick-${order.id}`}
                      className="rounded-lg border border-slate-200 p-4 flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{order.id}</p>
                        <p className="text-xs text-slate-500 mt-1">User: {order.user}</p>
                        <p className="text-xs text-slate-500">Date: {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">{order.amount}</p>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${
                          order.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Failed"
                            ? "bg-red-100 text-red-700"
                            : order.status === "Cancelled"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default AdminDashboard;
