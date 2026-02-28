import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { processPayment } from "../services/paymentService";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState("");

  // Order items (mock data - in real app, fetch from Order Service)
  const [orderItems] = useState([
    {
      id: 1,
      name: "Wireless Noise Cancelling Headphones",
      quantity: 2,
      unitPrice: 1500,
    },
    { id: 2, name: "Smart Fitness Watch Pro", quantity: 1, unitPrice: 2000 },
  ]);

  // Generate Order ID on mount
  useEffect(() => {
    const timestamp = Date.now();
    setOrderId(`ORD${timestamp}`);
  }, []);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Calculate total
  const subtotals = orderItems.map(
    (item) => item.quantity * item.unitPrice
  );
  const total = subtotals.reduce((sum, subtotal) => sum + subtotal, 0);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cvv") {
      formattedValue = value.replace(/[^0-9]/gi, "").slice(0, 3);
    }

    setCardDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Cardholder name validation
    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    } else if (cardDetails.cardholderName.trim().length < 3) {
      newErrors.cardholderName = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(cardDetails.cardholderName)) {
      newErrors.cardholderName = "Only letters and spaces allowed";
    }

    // Card number validation
    const cardNumberDigits = cardDetails.cardNumber.replace(/\s+/g, "");
    if (!cardNumberDigits) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    } else if (!/^\d+$/.test(cardNumberDigits)) {
      newErrors.cardNumber = "Only numeric values allowed";
    }

    // Expiry date validation
    if (!cardDetails.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else {
      const [month, year] = cardDetails.expiryDate.split("/");
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt("20" + year, 10);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiryDate = "Format must be MM/YY";
      } else if (monthNum < 1 || monthNum > 12) {
        newErrors.expiryDate = "Month must be between 01-12";
      } else if (
        yearNum < currentYear ||
        (yearNum === currentYear && monthNum < currentMonth)
      ) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // CVV validation
    if (!cardDetails.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (cardDetails.cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid
  const isFormValid = () => {
    if (paymentMethod === "cod") return true;
    return (
      cardDetails.cardholderName.trim().length >= 3 &&
      cardDetails.cardNumber.replace(/\s+/g, "").length === 16 &&
      cardDetails.expiryDate.length === 5 &&
      cardDetails.cvv.length === 3
    );
  };

  // Handle payment submission
  const handlePayment = async () => {
    if (paymentMethod === "online" && !validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call payment service via API Gateway
      const data = await processPayment({
        orderId: orderId,
        userId: "USER001",
        amount: total,
        paymentMethod: paymentMethod === "online" ? "CARD" : "COD",
      });

      // Simulate delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.status === "SUCCESS") {
        navigate("/payment-success", {
          state: {
            transactionId: data.transactionId,
            amount: total,
            paymentMethod: paymentMethod === "online" ? "Card" : "Cash on Delivery",
            orderId: orderId,
          },
        });
      } else {
        navigate("/payment-failed", {
          state: {
            reason: "Payment processing failed",
            amount: total,
            orderId: orderId,
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      navigate("/payment-failed", {
        state: {
          reason: "Network error occurred",
          amount: total,
          orderId: orderId,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-slate-600">
            Review your order and choose your payment method
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* Order ID */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Order ID</span>
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {orderId}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {orderItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start pb-4 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Qty: {item.quantity} × Rs. {item.unitPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">
                          Rs. {subtotals[index].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-slate-800">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-sky-600">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Method & Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Select Payment Method
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Online Payment */}
                  <label
                    className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-sky-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-5 h-5 text-sky-600" />
                        <span className="font-semibold text-slate-800">
                          Online Payment
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Pay securely with card
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-sky-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">💵</span>
                        <span className="font-semibold text-slate-800">
                          Cash on Delivery
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Pay when you receive
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Online Payment Section */}
              {paymentMethod === "online" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">
                      Card Details
                    </h3>

                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Left - Card Preview */}
                      <div>
                        <div className="relative">
                          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 shadow-2xl aspect-[1.586/1] relative overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-0 right-0 w-40 h-40 bg-sky-400 rounded-full blur-3xl"></div>
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-300 rounded-full blur-2xl"></div>
                            </div>

                            {/* Card content */}
                            <div className="relative h-full flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <div className="w-12 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-md"></div>
                                <div className="text-white text-xs font-semibold">
                                  VISA
                                </div>
                              </div>

                              <div>
                                <div className="text-white text-xl font-mono tracking-widest mb-4">
                                  {cardDetails.cardNumber || "•••• •••• •••• ••••"}
                                </div>

                                <div className="flex justify-between items-end">
                                  <div>
                                    <div className="text-slate-400 text-[10px] uppercase mb-1">
                                      Card Holder
                                    </div>
                                    <div className="text-white text-sm font-medium">
                                      {cardDetails.cardholderName.toUpperCase() ||
                                        "YOUR NAME"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 text-[10px] uppercase mb-1">
                                      Expires
                                    </div>
                                    <div className="text-white text-sm font-medium">
                                      {cardDetails.expiryDate || "MM/YY"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Input Form */}
                      <div className="space-y-5">
                        {/* Cardholder Name */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="cardholderName"
                            value={cardDetails.cardholderName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                              errors.cardholderName
                                ? "border-red-300 focus:ring-red-200"
                                : "border-slate-300 focus:ring-sky-200 focus:border-sky-400"
                            }`}
                          />
                          {errors.cardholderName && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                              <AlertCircle className="w-3 h-3" />
                              {errors.cardholderName}
                            </div>
                          )}
                        </div>

                        {/* Card Number */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all font-mono ${
                              errors.cardNumber
                                ? "border-red-300 focus:ring-red-200"
                                : "border-slate-300 focus:ring-sky-200 focus:border-sky-400"
                            }`}
                          />
                          {errors.cardNumber && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                              <AlertCircle className="w-3 h-3" />
                              {errors.cardNumber}
                            </div>
                          )}
                        </div>

                        {/* Expiry & CVV */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Expiry Date */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={cardDetails.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all font-mono ${
                                errors.expiryDate
                                  ? "border-red-300 focus:ring-red-200"
                                  : "border-slate-300 focus:ring-sky-200 focus:border-sky-400"
                              }`}
                            />
                            {errors.expiryDate && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                {errors.expiryDate}
                              </div>
                            )}
                          </div>

                          {/* CVV */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              maxLength={3}
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all font-mono ${
                                errors.cvv
                                  ? "border-red-300 focus:ring-red-200"
                                  : "border-slate-300 focus:ring-sky-200 focus:border-sky-400"
                              }`}
                            />
                            {errors.cvv && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                {errors.cvv}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={handlePayment}
                  disabled={!isFormValid() || loading}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                    isFormValid() && !loading
                      ? "bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white shadow-lg shadow-sky-500/25"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay Rs. {total.toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500 mt-4">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
