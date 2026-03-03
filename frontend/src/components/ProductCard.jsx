import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { useUser } from "../context/UserContext";

const ProductCard = ({ product }) => {
  const { addToCart, isAuthenticated } = useUser();
  const productId = product._id || product.id;
  const imageUrl = product.imageUrl || product.image;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please log in to add items to your cart.");
      return;
    }
    addToCart({ ...product, id: productId, _id: productId, image: imageUrl });
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      {/* Image container */}
      <div className="relative overflow-hidden bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-56 flex items-center justify-center text-6xl bg-slate-100">📦</div>
        )}
        {product.status === "Active" && product.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-amber-500">
            Featured
          </span>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-sky-50 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-slate-600 hover:text-sky-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-sky-600 font-medium mb-1">{product.category}</p>
        <Link to={`/products/${productId}`}>
          <h3 className="font-semibold text-slate-800 text-sm hover:text-sky-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-slate-800">LKR {product.price}</span>
          <div className="flex items-center gap-2">
            <Link
              to={`/products/${productId}`}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </Link>
            <button
              onClick={handleAddToCart}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
