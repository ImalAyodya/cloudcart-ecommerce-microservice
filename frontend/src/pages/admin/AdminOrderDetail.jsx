import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import { getOrderById, cancelOrder } from "../../services/orderService";
import { getProductById } from "../../services/productService";
import { getPaymentByTransactionId, getPaymentById } from "../../services/paymentService";

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

const orderStatusMessage = (status) => {
  if (status === "CREATED") return "Order is placed and waiting for confirmation.";
  if (status === "CONFIRMED") return "Order is confirmed and being processed.";
  if (status === "FAILED") return "This order failed.";
  if (status === "CANCELLED") return "This order has been cancelled.";
  return "Updating order status.";
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [productImages, setProductImages] = useState({});
  const [paymentMethodFromApi, setPaymentMethodFromApi] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getOrderById(id);
        setOrder(data);

        // Fetch product images
        const images = {};
        await Promise.all(
          (data.products || []).map(async (p) => {
            if (p.productId) {
              try {
                const res = await getProductById(p.productId);
                const prod = res?.product || res;
                if (prod?.imageUrl) images[p.productId] = prod.imageUrl;
              } catch {}
            }
          })
        );
        setProductImages(images);

        // Fetch payment method from transactionId
        if (data.transactionId) {
          console.log("📦 Order transactionId:", data.transactionId);
          let payment = null;
          try {
            const paymentRes = await getPaymentByTransactionId(data.transactionId);
            console.log("✅ getPaymentByTransactionId response:", JSON.stringify(paymentRes));
            payment = paymentRes?.payment || paymentRes?.data || paymentRes;
          } catch (e) {
            console.log("❌ getPaymentByTransactionId failed:", e.message);
            // Fallback: try getPaymentById with transactionId
            try {
              const paymentRes = await getPaymentById(data.transactionId);
              console.log("✅ getPaymentById fallback response:", JSON.stringify(paymentRes));
              payment = paymentRes?.payment || paymentRes?.data || paymentRes;
            } catch (e2) {
              console.log("❌ getPaymentById fallback also failed:", e2.message);
            }
          }
          if (payment) {
            console.log("💳 Payment object:", JSON.stringify(payment));
            const method = payment.paymentMethod || payment.method || payment.type || payment.payment_method;
            console.log("💳 Extracted method:", method);
            if (method) setPaymentMethodFromApi(method);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    const confirmed = window.confirm("Cancel this order?");
    if (!confirmed) return;

    setCancelLoading(true);
    setError("");
    try {
      const response = await cancelOrder(id);
      const updatedOrder = response?.order || response;
      setOrder((prev) => ({ ...prev, ...updatedOrder }));
    } catch (err) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  const canCancel = order?.status === "CREATED" || order?.status === "CONFIRMED";
  const paymentMethod = (paymentMethodFromApi || order?.paymentMethod || "").toString().toUpperCase();
  const isCard = paymentMethod.includes("CARD");
  const isCod = paymentMethod.includes("COD") || paymentMethod.includes("CASH");

  return (
    <div>
      <AdminHeader title="Order Details" />

      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/orders")}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 flex items-center justify-center gap-3 text-slate-500">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading order details...
          </div>
        ) : !order ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
            Order not found.
          </div>
        ) : (
          <>
            {/* Order Status Banner */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Order Number</p>
                  <p className="font-mono text-lg font-bold text-slate-800">
                    {order.OrderNumber || order.orderNumber || order._id}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusClass(order.status)}`}>
                    {order.status || "UNKNOWN"}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${paymentClass(order.paymentStatus)}`}>
                    Payment: {order.paymentStatus || "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-3 bg-slate-50 rounded-xl p-3">
                <p className="text-sm text-slate-700 font-medium">
                  {orderStatusMessage(order.status)}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Order Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">
                  Order Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Number</span>
                    <span className="font-semibold text-slate-800">
                      {order.OrderNumber || order.orderNumber || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">User ID</span>
                    <span className="font-mono text-slate-800 text-xs break-all text-right max-w-[60%]">
                      {order.userId || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-mono text-slate-800 text-xs">
                      {order.transactionId || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date</span>
                    <span className="text-slate-800">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Updated</span>
                    <span className="text-slate-800">
                      {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">
                  Payment Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Status</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentClass(order.paymentStatus)}`}>
                      {order.paymentStatus || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Amount</span>
                    <span className="text-lg font-bold text-slate-800">
                      LKR {Number(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-slate-500 mb-2">Payment Method</p>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-default">
                        <input type="radio" checked={isCard} readOnly className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-slate-700">Card</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-default">
                        <input type="radio" checked={isCod} readOnly className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-slate-700">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">
                Products ({order.products?.length || 0})
              </h3>
              <div className="space-y-3">
                {order.products?.length ? (
                  order.products.map((product, index) => {
                    const quantity = Number(product.quantity || 0);
                    const unitPrice = Number(product.price || 0);
                    const lineTotal = unitPrice * quantity;
                    const productName = product.productName || product.name || product.productId || "Product";

                    return (
                      <div
                        key={`${product.productId || productName}-${index}`}
                        className="border border-slate-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {productImages[product.productId] ? (
                            <img
                              src={productImages[product.productId]}
                              alt={productName}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                          <p className="text-sm font-semibold text-slate-800">{productName}</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-700">
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Qty</p>
                            <p className="font-semibold">{quantity}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Unit Price</p>
                            <p className="font-semibold">LKR {unitPrice.toFixed(2)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Subtotal</p>
                            <p className="font-bold text-slate-800">LKR {lineTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">No products available for this order.</p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Total Amount</p>
                  <p className="text-xl font-bold text-slate-800">
                    LKR {Number(order.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => navigate("/admin/orders")}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Back to Orders
              </button>
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    cancelLoading
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {cancelLoading ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetail;
