import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";

import { getAllProducts, getProductStats } from "../../services/productService";

const ProductManagement = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, lowStock: 0, outOfStock: 0 });
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [productRes, statsRes] = await Promise.all([
          getAllProducts(),
          getProductStats()
        ]);
        setProducts(productRes.products || []);
        setStats(statsRes);
        // Extract unique categories from products
        const cats = Array.from(new Set(productRes.products.map(p => p.category)));
        setCategories(["All", ...cats]);
      } catch (err) {
        setError("Failed to load products or stats");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (categoryFilter === "All" || product.category === categoryFilter) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div>
      <AdminHeader title="Product Management" />

      <div className="p-6">
        {loading && <div className="mb-4 text-center text-slate-500">Loading products...</div>}
        {error && <div className="mb-4 text-center text-red-500">{error}</div>}
        {/* Service Info Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Product Service</h2>
              <p className="text-emerald-100">Manages product catalog, inventory, and stock operations</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-emerald-200">Total Products</p>
            </div>
          </div>
        </div>

       

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-sm text-slate-500">Total Products</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
            <p className="text-sm text-slate-500">Active</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            <p className="text-sm text-slate-500">Low Stock</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            <p className="text-sm text-slate-500">Out of Stock</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Link
            to="/admin/products/add"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id || product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-slate-100 flex items-center justify-center text-6xl">
                {/* Optionally show image or fallback */}
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-24 object-contain" />
                ) : (
                  <span role="img" aria-label="product">📦</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{product.category}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                    product.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
                    product.status === "Out of Stock" ? "bg-red-100 text-red-700" :
                    "bg-slate-200 text-slate-600"
                  }`}>
                    {product.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-bold text-emerald-600">LKR {product.price}</p>
                  <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/products/${product._id || product.id}/edit`}
                    className="flex-1 text-center py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/admin/products/${product._id || product.id}`}
                    className="flex-1 text-center py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
