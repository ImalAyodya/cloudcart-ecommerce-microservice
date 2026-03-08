import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  PackageOpen,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { getUserById } from "../services/userService";
import { createOrder } from "../services/orderService";

const OrderCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart, user, isAuthenticated } = useUser();

  const buyNowItem = location.state?.buyNowItem || null;

  const checkoutItems = useMemo(() => {
    if (buyNowItem) {
      return [buyNowItem];
    }
    return cart;
  }, [buyNowItem, cart]);

  const [customer, setCustomer] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    postalCode: "",
  });

  const userId = user?._id || user?.id || user?.email || "";

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!userId) return;
      try {
        const data = await getUserById(userId);
        setCustomer((prev) => ({
          ...prev,
          fullName: data?.name || prev.fullName,
          email: data?.email || prev.email,
          phone: data?.phone || prev.phone,
          address: data?.address || prev.address,
        }));
      } catch {
        // Keep local user/context values when API lookup fails.
      }
    };

    fetchCustomerDetails();
  }, [userId]);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const shippingFee = subtotal > 100 ? 0 : 9.99;
  const totalAmount = subtotal + shippingFee;

  const validate = () => {
    const nextErrors = {};

    if (!customer.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!customer.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!customer.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!customer.address.trim()) nextErrors.address = "Address is required";
    if (!customer.city.trim()) nextErrors.city = "City is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (checkoutItems.length === 0) {
      navigate("/cart");
      return;
    }

    if (!validate()) return;

    setPlacingOrder(true);
    setError("");

    const payload = {
      userId,
      paymentMethod,
      products: checkoutItems.map((item) => ({
        productId: item._id || item.id,
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
      })),
    };

    try {
      const data = await createOrder(payload);
      const savedOrder = data.order || data;

      if (!buyNowItem) {
        clearCart();
      }

      navigate("/order-success", {
        state: {
          order: savedOrder,
          items: checkoutItems,
          totalAmount,
          shippingFee,
          customer,
          paymentMethod,
        },
      });
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5 px-4 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">Log in to place an order</h2>
        <p className="text-sm text-slate-500">Your checkout is protected and tied to your account.</p>
        <Link
          to="/login"
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5 px-4 text-center">
        <PackageOpen className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">No items to checkout</h2>
        <p className="text-sm text-slate-500">Add products to your cart, then continue to checkout.</p>
        <Link
          to="/products"
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-1">Checkout</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/home" className="hover:text-sky-400">Home</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-sky-400">Cart</Link>
            <span>/</span>
            <span className="text-sky-400">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                Delivery Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">Full Name</label>
                  <input
                    value={customer.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`mt-1 w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? "border-red-300 focus:ring-red-100"
                        : "border-slate-200 focus:ring-sky-200"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">Email</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`mt-1 w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-300 focus:ring-red-100"
                        : "border-slate-200 focus:ring-sky-200"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">Phone</label>
                  <input
                    value={customer.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`mt-1 w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? "border-red-300 focus:ring-red-100"
                        : "border-slate-200 focus:ring-sky-200"
                    }`}
                    placeholder="+94 7X XXX XXXX"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">City</label>
                  <input
                    value={customer.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`mt-1 w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.city
                        ? "border-red-300 focus:ring-red-100"
                        : "border-slate-200 focus:ring-sky-200"
                    }`}
                    placeholder="Colombo"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-600">Address</label>
                  <input
                    value={customer.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={`mt-1 w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.address
                        ? "border-red-300 focus:ring-red-100"
                        : "border-slate-200 focus:ring-sky-200"
                    }`}
                    placeholder="Street, area, landmark"
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-600">Postal Code (optional)</label>
                  <input
                    value={customer.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="10100"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                Payment Method
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <label
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "CARD"
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === "CARD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="font-semibold text-slate-800">Card Payment</span>
                  <p className="text-xs text-slate-500 mt-1">Pay now with debit or credit card</p>
                </label>

                <label
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="font-semibold text-slate-800">Cash on Delivery</span>
                  <p className="text-xs text-slate-500 mt-1">Pay when your package arrives</p>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Order Summary</h2>

              <div className="space-y-4 max-h-72 overflow-auto pr-1">
                {checkoutItems.map((item) => {
                  const itemId = item._id || item.id;
                  const imageUrl = item.imageUrl || item.image;
                  const quantity = Number(item.quantity || 1);
                  const itemTotal = Number(item.price || 0) * quantity;

                  return (
                    <div key={itemId} className="flex gap-3 pb-4 border-b border-slate-100">
                      <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <PackageOpen className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {quantity}</p>
                        <p className="text-sm font-semibold text-sky-600 mt-1">
                          LKR {itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 text-sm mt-5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">LKR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `LKR ${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 border-t border-slate-100 pt-3">
                  <span>Total</span>
                  <span>LKR {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-colors ${
                  placingOrder
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-sky-600 hover:bg-sky-700"
                }`}
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-5 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Secure checkout process</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span>Estimated delivery in 2-5 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Order confirmation by email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckoutPage;
