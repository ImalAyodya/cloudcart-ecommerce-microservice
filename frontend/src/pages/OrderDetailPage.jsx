import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Loader2,
  Package,
  Wallet,
  XCircle,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { getOrderById, cancelOrder } from "../services/orderService";
import { getProductById } from "../services/productService";
import { getPaymentByTransactionId } from "../services/paymentService";

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
  if (status === "CREATED") return "Your order is placed and waiting for confirmation.";
  if (status === "CONFIRMED") return "Your order is confirmed and being processed.";
  if (status === "FAILED") return "This order failed. Please contact support if needed.";
  if (status === "CANCELLED") return "This order has been cancelled.";
  return "We are updating your order status.";
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [productImages, setProductImages] = useState({});
  const [paymentMethodFromApi, setPaymentMethodFromApi] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

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
          try {
            const paymentRes = await getPaymentByTransactionId(data.transactionId);
            const payment = paymentRes?.payment || paymentRes;
            if (payment?.paymentMethod) {
              setPaymentMethodFromApi(payment.paymentMethod);
            }
          } catch {}
        }
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Package className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">Sign in to view order details</h2>
        <Link
          to="/login"
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading order details...
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-300" />
        <h2 className="text-xl font-semibold text-slate-700">{error}</h2>
        <button
          onClick={() => navigate("/my-orders")}
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const canCancel = order?.status === "CREATED" || order?.status === "CONFIRMED";
  const paymentMethod = (paymentMethodFromApi || order?.paymentMethod || "").toString().toUpperCase();
  const isCard = paymentMethod.includes("CARD");
  const isCod = paymentMethod.includes("COD") || paymentMethod.includes("CASH");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-1">Order Details</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/home" className="hover:text-sky-400">Home</Link>
            <span>/</span>
            <Link to="/my-orders" className="hover:text-sky-400">My Orders</Link>
            <span>/</span>
            <span className="text-sky-400">Order Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/my-orders")}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Orders
        </button>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Order Status Banner */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
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

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Order Information */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
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
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
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

              {/* Payment Method Radios */}
              <div className="pt-2">
                <p className="text-slate-500 mb-2">Payment Method</p>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-default">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={isCard}
                      readOnly
                      className="w-4 h-4 text-sky-600"
                    />
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700">Card</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-default">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={isCod}
                      readOnly
                      className="w-4 h-4 text-sky-600"
                    />
                    <Wallet className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">
            Products ({order.products?.length || 0})
          </h3>

          <div className="space-y-3">
            {order.products?.length ? (
              order.products.map((product, index) => {
                const quantity = Number(product.quantity || 0);
                const unitPrice = Number(product.price || 0);
                const lineTotal = unitPrice * quantity;
                const productName =
                  product.productName || product.name || product.productId || "Product";

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
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{productName}</p>
                      </div>
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

          {/* Total */}
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
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>

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
              {cancelLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
