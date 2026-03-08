import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, PackageOpen } from "lucide-react";
import { useUser } from "../context/UserContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQty, clearCart, cartTotal, isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5">
        <ShoppingBag className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">Please log in to view your cart</h2>
        <Link
          to="/login"
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5">
        <PackageOpen className="w-20 h-20 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">Your cart is empty</h2>
        <p className="text-sm text-slate-500">Browse our products and add something you like!</p>
        <Link
          to="/products"
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const orderTotal = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-1">Shopping Cart</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/home" className="hover:text-sky-400">Home</Link>
            <span>/</span>
            <span className="text-sky-400">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700">
                {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
              </h2>
              <button
                onClick={clearCart}
                className="text-xs text-rose-500 hover:text-rose-700 transition-colors"
              >
                Clear all
              </button>
            </div>

            {cart.map((item) => {
              const itemId = item._id || item.id;
              const imageUrl = item.imageUrl || item.image;

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PackageOpen className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${itemId}`}
                      className="text-sm font-semibold text-slate-800 hover:text-sky-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                    <p className="text-sm font-bold text-sky-600 mt-1">
                      LKR {parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={() => updateCartQty(itemId, item.quantity - 1)}
                      className="px-2.5 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <span className="px-3 py-2 text-sm font-semibold text-slate-800 border-x border-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(itemId, item.quantity + 1)}
                      className="px-2.5 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right shrink-0 w-20">
                    <p className="text-sm font-bold text-slate-800">
                      LKR {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-base font-bold text-slate-800 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">LKR {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `LKR ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-slate-400">
                    Add LKR {(100 - cartTotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 mt-5 pt-5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Total</span>
                  <span>LKR {orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">Secure checkout powered by CloudCart</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
