import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home, Receipt, ArrowRight } from "lucide-react";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId, amount, paymentMethod, orderId } = location.state || {};

  useEffect(() => {
    // If no state, redirect to home
    if (!transactionId) {
      navigate("/home");
    }
  }, [transactionId, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 animate-scaleIn shadow-2xl">
                <CheckCircle className="w-14 h-14 text-emerald-500" strokeWidth={2.5} />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3">
                Payment Successful!
              </h1>
              <p className="text-emerald-100 text-lg">
                Your order has been confirmed
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <div className="bg-slate-50 rounded-2xl p-6 mb-6">
              <div className="grid gap-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 text-sm">Order ID</span>
                  <span className="text-slate-800 font-mono font-semibold">
                    {orderId}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 text-sm">Transaction ID</span>
                  <span className="text-slate-800 font-mono font-semibold">
                    {transactionId}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 text-sm">Payment Method</span>
                  <span className="text-slate-800 font-semibold">
                    {paymentMethod}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 text-sm">Amount Paid</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    Rs. {amount?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Status</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <Receipt className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-sky-900 mb-1">
                    Receipt Sent
                  </p>
                  <p className="text-xs text-sky-700">
                    A confirmation email with your receipt has been sent to your registered email address.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
              
              <button
                onClick={() => navigate("/products")}
                className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-slate-300 hover:border-sky-500 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-xl font-semibold transition-all"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Need help? Contact our{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-sky-600 hover:text-sky-700 font-semibold underline"
            >
              support team
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;
