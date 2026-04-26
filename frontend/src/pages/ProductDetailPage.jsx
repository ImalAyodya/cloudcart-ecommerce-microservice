import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  ChevronRight,
  PackageOpen,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getProductById, getAllProducts } from "../services/productService";
import { useUser } from "../context/UserContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useUser();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setQuantity(1);
    setAddedMsg("");

    getProductById(id)
      .then((res) => {
        const p = res.product || res;
        setProduct(p);
        return getAllProducts().then((allRes) => {
          const all = allRes.products || [];
          const rel = all
            .filter(
              (item) =>
                item.category === p.category &&
                (item._id || item.id) !== id &&
                item.status === "Active"
            )
            .slice(0, 4);
          setRelated(rel);
        });
      })
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    addToCart(product, quantity);
    setAddedMsg("Added to cart!");
    setTimeout(() => setAddedMsg(""), 2500);
  };

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      alert("Please log in to place an order.");
      navigate("/login");
      return;
    }

    const productId = product._id || product.id;

    navigate("/checkout", {
      state: {
        buyNowItem: {
          ...product,
          id: productId,
          _id: productId,
          image: imageUrl,
          quantity,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-sm">{error || "Product not found."}</p>
        <Link to="/products" className="text-sky-600 text-sm hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const imageUrl = product.imageUrl;
  const maxQty = product.stock > 0 ? product.stock : 0;
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/home" className="hover:text-sky-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-sky-600">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center h-[420px]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <PackageOpen className="w-20 h-20" />
                    <span className="text-sm">No image available</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              {product.featured && (
                <span className="inline-block px-3 py-1 bg-sky-100 text-sky-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wide">
                  Featured
                </span>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-sky-600 font-medium mb-4">{product.category}</p>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl font-bold text-slate-800">
                  LKR {parseFloat(product.price).toFixed(2)}
                </span>
              </div>

              <div className="mb-5">
                {inStock ? (
                  <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {product.sku && (
                <p className="text-xs text-slate-400 mb-5">SKU: {product.sku}</p>
              )}

              {product.description && (
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {inStock && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2.5 hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="px-5 py-2.5 text-sm font-semibold text-slate-800 border-x border-slate-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                      className="px-3 py-2.5 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                  <div className="flex-1 grid sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>

                    <button
                      onClick={handleOrderNow}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      Order Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {addedMsg && (
                <p className="text-sm text-emerald-600 font-medium mb-4">{addedMsg}</p>
              )}

              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-100">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Truck className="w-5 h-5 text-sky-500" />
                  <span className="text-xs text-slate-500">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <ShieldCheck className="w-5 h-5 text-sky-500" />
                  <span className="text-xs text-slate-500">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <RefreshCw className="w-5 h-5 text-sky-500" />
                  <span className="text-xs text-slate-500">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((item) => (
                <ProductCard key={item._id || item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
