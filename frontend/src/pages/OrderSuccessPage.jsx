import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Receipt, ShoppingBag } from "lucide-react";

const statusClass = (status) => {
  if (status === "CONFIRMED") return "bg-emerald-100 text-emerald-700";
  if (status === "CREATED") return "bg-amber-100 text-amber-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    order,
    payment,
    items,
    totalAmount,
    shippingFee,
    customer,
    paymentMethod,
  } = location.state || {};

  const resolvedPaymentMethod = (
    payment?.paymentMethod || paymentMethod || order?.paymentMethod || "N/A"
  )
    .toString()
    .toUpperCase();

  const normalizedPaymentMethod = resolvedPaymentMethod.includes("CASH")
    ? "COD"
    : resolvedPaymentMethod.includes("CARD")
      ? "CARD"
      : resolvedPaymentMethod;

  const isCardPayment = normalizedPaymentMethod === "CARD";
  const isCodPayment = normalizedPaymentMethod === "COD";

  useEffect(() => {
    if (!order) {
      navigate("/home");
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-10 text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold">Order Placed Successfully</h1>
            <p className="text-emerald-100 mt-2">Your purchase is confirmed and being prepared.</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">OrderNumber</p>
                  <p className="font-mono font-semibold text-slate-800 break-all">{order.OrderNumber || order.orderNumber || order._id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Placed On</p>
                  <p className="font-semibold text-slate-800">
                    {new Date(order.createdAt || Date.now()).toLocaleString()}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-slate-500 mb-2">Payment Method</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label
                      className={`pointer-events-none flex items-start gap-2 rounded-xl border px-3 py-2 ${
                        isCardPayment
                          ? "border-sky-300 bg-sky-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <input type="radio" checked={isCardPayment} readOnly className="mt-0.5" />
                      <span>
                        <span className="block font-semibold text-slate-800">Card Payment</span>
                        <span className="text-xs text-slate-500">Pay now with debit or credit card</span>
                      </span>
                    </label>

                    <label
                      className={`pointer-events-none flex items-start gap-2 rounded-xl border px-3 py-2 ${
                        isCodPayment
                          ? "border-sky-300 bg-sky-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <input type="radio" checked={isCodPayment} readOnly className="mt-0.5" />
                      <span>
                        <span className="block font-semibold text-slate-800">Cash on Delivery</span>
                        <span className="text-xs text-slate-500">Pay when your package arrives</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-sky-600" />
                Items Ordered
              </h2>
              <div className="space-y-3">
                {(items || []).map((item) => {
                  const key = `${item._id || item.id}-${item.quantity || 1}`;
                  const qty = Number(item.quantity || 1);
                  const rowTotal = Number(item.price || 0) * qty;
                  return (
                    <div key={key} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.name || `Product ${item._id || item.id}`}</p>
                        <p className="text-xs text-slate-500">Qty: {qty}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">LKR {rowTotal.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Receipt className="w-5 h-5 text-sky-600 mt-0.5" />
                <div className="text-sm text-sky-900">
                  <p className="font-semibold">Delivery to</p>
                  <p>{customer?.fullName || "Customer"}</p>
                  <p>{customer?.address || "Address not provided"}</p>
                  <p>{customer?.city || ""}</p>
                  <p className="mt-1 text-xs text-sky-700">Updates will be sent to {customer?.email || "your email"}.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>LKR {Number((totalAmount || 0) - (shippingFee || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 mt-2">
                <span>Shipping</span>
                <span>{shippingFee ? `LKR ${Number(shippingFee).toFixed(2)}` : "Free"}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 mt-3 pt-3 border-t border-slate-100">
                <span>Total</span>
                <span>LKR {Number(totalAmount || order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <Link
                to="/my-orders"
                className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm"
              >
                <Package className="w-4 h-4" />
                My Orders
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
