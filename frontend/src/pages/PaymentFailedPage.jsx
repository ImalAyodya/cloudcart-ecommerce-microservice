import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XCircle, RefreshCw, Home, AlertTriangle, ArrowLeft } from "lucide-react";

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reason, amount, orderId } = location.state || {};

  useEffect(() => {
    // If no state, redirect to home
    if (!reason) {
      navigate("/home");
    }
  }, [reason, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Failed Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Failed Header */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 animate-shakeIn shadow-2xl">
                <XCircle className="w-14 h-14 text-red-500" strokeWidth={2.5} />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3">
                Payment Failed
              </h1>
              <p className="text-red-100 text-lg">
                We couldn't process your payment
              </p>
            </div>
          </div>

          {/* Error Details */}
          <div className="p-8">
            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Transaction Failed
                  </p>
                  <p className="text-sm text-red-700">
                    {reason || "An error occurred while processing your payment"}
                  </p>
                </div>
              </div>
            </div>

            {/* Failed Transaction Details */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-6">
              <div className="grid gap-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 text-sm">Order ID</span>
                  <span className="text-slate-800 font-mono font-semibold">
                    {orderId}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 text-sm">Attempted Amount</span>
                  <span className="text-2xl font-bold text-slate-800">
                    Rs. {amount?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 text-sm">Status</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Failed
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Amount Charged</span>
                  <span className="text-slate-800 font-semibold">
                    Rs. 0.00
                  </span>
                </div>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-sky-900 mb-3">
                Common Reasons for Payment Failure:
              </h3>
              <ul className="space-y-2 text-sm text-sky-800">
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 mt-0.5">•</span>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 mt-0.5">•</span>
                  <span>Incorrect card details or expired card</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 mt-0.5">•</span>
                  <span>Bank declined the transaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 mt-0.5">•</span>
                  <span>Network or connectivity issues</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <button
                onClick={() => navigate("/home")}
                className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Need assistance?{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-sky-600 hover:text-sky-700 font-semibold underline"
            >
              Contact Support
            </button>
            {" "}or call 1-800-CLOUDCART
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shakeIn {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-shakeIn {
          animation: shakeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default PaymentFailedPage;
