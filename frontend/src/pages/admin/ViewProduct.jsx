import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import { getProductById, deleteProduct } from "../../services/productService";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (err) {
        setError("Failed to load product");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(id);
      navigate("/admin/products");
    } catch (err) {
      setError("Failed to delete product: " + err.message);
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminHeader title="Product Details" />
        <div className="p-6 flex items-center justify-center min-h-64">
          <div className="text-slate-500 text-center">
            <svg className="w-10 h-10 animate-spin mx-auto mb-3 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <AdminHeader title="Product Details" />
        <div className="p-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error || "Product not found"}</div>
          <Link to="/admin/products" className="mt-4 inline-block text-emerald-600 hover:underline">&larr; Back to Products</Link>
        </div>
      </div>
    );
  }

  const statusColor =
    product.status === "Active" ? "bg-emerald-100 text-emerald-700" :
    product.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
    product.status === "Out of Stock" ? "bg-red-100 text-red-700" :
    "bg-slate-100 text-slate-600";

  return (
    <div>
      <AdminHeader title="Product Details" />

      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/admin/products" className="hover:text-emerald-600">Product Management</Link>
          <span>/</span>
          <span className="text-slate-800">Product Details</span>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Image & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-56 bg-slate-100 flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-48 object-contain" />
                ) : (
                  <span className="text-7xl">📦</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}>
                    {product.status}
                  </span>
                  {product.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 font-medium px-3 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Quick Info</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Price</span>
                <span className="text-lg font-bold text-emerald-600">LKR {product.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Stock</span>
                <span className={`font-semibold ${product.stock === 0 ? "text-red-600" : product.stock <= 10 ? "text-yellow-600" : "text-slate-800"}`}>
                  {product.stock} units
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">SKU</span>
                <span className="font-mono text-slate-800">{product.sku || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Category</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">{product.category}</span>
              </div>
            </div>
          </div>

          {/* Right: Full Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Product Information</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Product Name</p>
                  <p className="text-xl font-bold text-slate-800">{product.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Created At</p>
                    <p className="text-sm text-slate-700">{product.createdAt ? new Date(product.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
                    <p className="text-sm text-slate-700">{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Actions</h2>
              </div>
              <div className="p-6 flex flex-wrap gap-3">
                <Link
                  to={`/admin/products/${product._id}/edit`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Product
                </Link>
                <Link
                  to="/admin/products"
                  className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Products
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-60 ml-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {deleteLoading ? "Deleting..." : "Delete Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
