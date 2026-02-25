import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sample payment data
  const payments = [
    {
      id: "PAY-001",
      orderId: "ORD-001",
      user: "John Doe",
      amount: 119.97,
      method: "Credit Card",
      cardLast4: "4242",
      status: "Completed",
      processedAt: "2026-02-24 10:30:00",
    },
    {
      id: "PAY-002",
      orderId: "ORD-002",
      user: "Jane Smith",
      amount: 199.99,
      method: "Credit Card",
      cardLast4: "5555",
      status: "Completed",
      processedAt: "2026-02-24 11:15:00",
    },
    {
      id: "PAY-003",
      orderId: "ORD-003",
      user: "Bob Wilson",
      amount: 109.97,
      method: "PayPal",
      cardLast4: null,
      status: "Pending",
      processedAt: null,
    },
    {
      id: "PAY-004",
      orderId: "ORD-004",
      user: "Alice Brown",
      amount: 129.99,
      method: "Credit Card",
      cardLast4: "1234",
      status: "Completed",
      processedAt: "2026-02-23 14:20:00",
    },
    {
      id: "PAY-005",
      orderId: "ORD-005",
      user: "Charlie Davis",
      amount: 99.98,
      method: "Debit Card",
      cardLast4: "9876",
      status: "Completed",
      processedAt: "2026-02-22 09:45:00",
    },
    {
      id: "PAY-006",
      orderId: "ORD-006",
      user: "Diana Lee",
      amount: 59.99,
      method: "Credit Card",
      cardLast4: "6789",
      status: "Refunded",
      processedAt: "2026-02-21 16:30:00",
    },
    {
      id: "PAY-007",
      orderId: "ORD-007",
      user: "Edward King",
      amount: 245.00,
      method: "Credit Card",
      cardLast4: "3333",
      status: "Failed",
      processedAt: "2026-02-20 11:00:00",
    },
  ];

  const statuses = ["All", "Completed", "Pending", "Failed", "Refunded"];

  const filteredPayments = payments.filter(
    (payment) =>
      (statusFilter === "All" || payment.status === statusFilter) &&
      (payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const endpoints = [
    { method: "POST", path: "/payments/process", description: "Process payment for order" },
    { method: "GET", path: "/payments/{id}", description: "Get payment details" },
  ];

  const totalRevenue = payments.filter(p => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = payments.filter(p => p.status === "Refunded").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <AdminHeader title="Payment Management" />

      <div className="p-6">
        {/* Service Info Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Payment Service</h2>
              <p className="text-orange-100">Handles payment processing, validation, and status management</p>
              
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
              <p className="text-orange-200">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Refunded</p>
            <p className="text-2xl font-bold text-red-600">${refundedAmount.toFixed(2)}</p>
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
              placeholder="Search by payment ID, order ID, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Payment ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Order</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Method</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Processed At</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-semibold text-orange-600">{payment.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-purple-600">{payment.orderId}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-800">{payment.user}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800">${payment.amount.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {payment.method === "Credit Card" && (
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                          </svg>
                        )}
                        {payment.method === "PayPal" && (
                          <span className="text-blue-800 font-bold text-sm">PP</span>
                        )}
                        {payment.method === "Debit Card" && (
                          <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                          </svg>
                        )}
                        <span className="text-sm text-slate-600">
                          {payment.method}
                          {payment.cardLast4 && <span className="text-slate-400"> •••• {payment.cardLast4}</span>}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        payment.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                        payment.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        payment.status === "Refunded" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {payment.processedAt || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {payment.status === "Completed" && (
                          <button className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                          </button>
                        )}
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
              Showing {filteredPayments.length} of {payments.length} payments
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm">1</button>
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

export default PaymentManagement;
