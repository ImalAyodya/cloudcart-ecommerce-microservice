import AdminHeader from "../../components/admin/AdminHeader";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
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
      value: "456",
      change: "+8%",
      changeType: "positive",
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
      value: "789",
      change: "+23%",
      changeType: "positive",
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
      value: "$45,678",
      change: "+18%",
      changeType: "positive",
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

  const recentOrders = [
    { id: "ORD-001", user: "John Doe", amount: "$150.00", status: "Completed", date: "2026-02-24" },
    { id: "ORD-002", user: "Jane Smith", amount: "$89.99", status: "Processing", date: "2026-02-24" },
    { id: "ORD-003", user: "Bob Wilson", amount: "$234.50", status: "Pending", date: "2026-02-23" },
    { id: "ORD-004", user: "Alice Brown", amount: "$67.00", status: "Completed", date: "2026-02-23" },
    { id: "ORD-005", user: "Charlie Davis", amount: "$445.00", status: "Shipped", date: "2026-02-22" },
  ];

  const serviceEndpoints = [
    { service: "User Service", endpoints: ["POST /users/register", "POST /users/login", "GET /users/{id}", "GET /users/validate/{id}"], owner: "Imal" },
    { service: "Product Service", endpoints: ["POST /products", "GET /products", "GET /products/{id}", "PUT /products/{id}", "POST /products/{id}/reduce-stock"], owner: "Sithmaka" },
    { service: "Order Service", endpoints: ["POST /orders", "GET /orders/{id}", "GET /orders/user/{userId}"], owner: "Malmi" },
    { service: "Payment Service", endpoints: ["POST /payments/process", "GET /payments/{id}"], owner: "Pasan" },
  ];

  return (
    <div>
      <AdminHeader title="Dashboard" />
      
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"}`}>
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
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 px-6 text-sm font-medium text-slate-800">{order.id}</td>
                      <td className="py-3 px-6 text-sm text-slate-600">{order.user}</td>
                      <td className="py-3 px-6 text-sm text-slate-600">{order.amount}</td>
                      <td className="py-3 px-6">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          order.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                          order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                          order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Service Communication Flow */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Service Communication Flow</h2>
            <p className="text-sm text-slate-500 mb-6">How microservices interact when placing an order</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="text-sm font-medium text-purple-800">Order Service → User Service</p>
                  <p className="text-xs text-purple-600">GET /users/validate/{"{userId}"} - Check if user exists</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="text-sm font-medium text-emerald-800">Order Service → Product Service</p>
                  <p className="text-xs text-emerald-600">GET /products/{"{id}"}/availability - Check stock</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="text-sm font-medium text-orange-800">Order Service → Payment Service</p>
                  <p className="text-xs text-orange-600">POST /payments/process - Process payment</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Order Service → Product Service</p>
                  <p className="text-xs text-blue-600">POST /products/{"{id}"}/reduce-stock - Reduce quantity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default AdminDashboard;
