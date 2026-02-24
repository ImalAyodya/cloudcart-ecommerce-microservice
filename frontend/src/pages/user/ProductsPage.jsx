import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../../components/user/ProductCard";

const allProducts = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    category: "Electronics",
    price: "249.99",
    oldPrice: "349.99",
    rating: 5,
    reviews: 128,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Premium Leather Crossbody Bag",
    category: "Fashion",
    price: "89.99",
    rating: 4,
    reviews: 64,
    badge: "New",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Smart Fitness Watch Pro",
    category: "Electronics",
    price: "199.99",
    oldPrice: "279.99",
    rating: 5,
    reviews: 312,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Minimalist Desk Lamp",
    category: "Home & Living",
    price: "59.99",
    rating: 4,
    reviews: 89,
    badge: "New",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Running Shoes Ultra Boost",
    category: "Sports & Outdoors",
    price: "159.99",
    oldPrice: "199.99",
    rating: 5,
    reviews: 256,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Organic Coffee Beans 1kg",
    category: "Food & Beverages",
    price: "24.99",
    rating: 4,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Vintage Polaroid Camera",
    category: "Electronics",
    price: "129.99",
    rating: 4,
    reviews: 92,
    badge: "New",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Premium Sunglasses Collection",
    category: "Fashion",
    price: "79.99",
    oldPrice: "119.99",
    rating: 5,
    reviews: 145,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    name: "Bluetooth Portable Speaker",
    category: "Electronics",
    price: "69.99",
    oldPrice: "99.99",
    rating: 4,
    reviews: 203,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    name: "Ceramic Plant Pot Set",
    category: "Home & Living",
    price: "34.99",
    rating: 4,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
  },
  {
    id: 11,
    name: "Men's Classic Leather Wallet",
    category: "Fashion",
    price: "49.99",
    rating: 5,
    reviews: 89,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
  },
  {
    id: 12,
    name: "Yoga Mat Premium Non-Slip",
    category: "Sports & Outdoors",
    price: "39.99",
    rating: 4,
    reviews: 156,
    badge: "New",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
  },
];

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports & Outdoors",
  "Food & Beverages",
];

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = allProducts
    .filter(
      (p) => selectedCategory === "All" || p.category === selectedCategory
    )
    .filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "price-high") return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">All Products</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/home" className="hover:text-sky-400">
              Home
            </Link>
            <span>/</span>
            <span className="text-sky-400">Products</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="hidden md:flex items-center text-sm text-slate-500">
            Showing {filteredProducts.length} products
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-60 shrink-0`}
          >
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 text-sm">
                  Categories
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-sky-50 text-sky-600 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Price range */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm mb-3">
                  Price Range
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Rating filter */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm mb-3">
                  Rating
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3].map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      {r} Stars & Up
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">
                  No products found
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
