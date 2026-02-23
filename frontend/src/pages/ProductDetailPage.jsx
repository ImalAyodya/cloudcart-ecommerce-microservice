import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";
import ProductCard from "../components/ProductCard";

const productData = {
  id: 1,
  name: "Wireless Noise Cancelling Headphones Pro",
  category: "Electronics",
  price: "249.99",
  oldPrice: "349.99",
  rating: 5,
  reviews: 128,
  badge: "Sale",
  description:
    "Experience premium sound quality with our flagship wireless headphones. Featuring advanced noise cancellation technology, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers, remote workers, and frequent travelers.",
  features: [
    "Active Noise Cancellation (ANC)",
    "40-hour battery life",
    "Bluetooth 5.3 connectivity",
    "Memory foam ear cushions",
    "Foldable design with travel case",
    "Built-in microphone for calls",
    "Touch controls on ear cups",
    "Quick charge: 10 min = 3 hours",
  ],
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop",
  ],
  colors: ["Black", "Silver", "Navy"],
  specs: {
    Brand: "CloudCart Audio",
    Model: "CC-WH Pro 2026",
    Weight: "250g",
    Driver: "40mm dynamic",
    Impedance: "32 Ohm",
    Connectivity: "Bluetooth 5.3, 3.5mm",
  },
};

const relatedProducts = [
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
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [activeTab, setActiveTab] = useState("description");

  const product = productData;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/home" className="hover:text-sky-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-sky-600">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Images */}
            <div>
              <div className="rounded-xl overflow-hidden bg-slate-50 mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? "border-sky-500"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              {product.badge && (
                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wide">
                  {product.badge} — Save ${(parseFloat(product.oldPrice) - parseFloat(product.price)).toFixed(2)}
                </span>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-sky-600 font-medium mb-3">
                {product.category}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-500">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-slate-800">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-slate-400 line-through">
                    ${product.oldPrice}
                  </span>
                )}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-800 mb-2">
                  Color: <span className="font-normal text-slate-500">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                        selectedColor === color
                          ? "border-sky-500 bg-sky-50 text-sky-700 font-medium"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-800 mb-2">
                  Quantity
                </p>
                <div className="inline-flex items-center border border-slate-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-slate-50"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-slate-50"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <button className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="px-4 border border-slate-200 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors">
                  <Heart className="w-5 h-5 text-slate-400 hover:text-rose-500" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, text: "Free Shipping" },
                  { icon: ShieldCheck, text: "2 Year Warranty" },
                  { icon: RefreshCw, text: "30-Day Returns" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-xl text-center"
                  >
                    <item.icon className="w-5 h-5 text-sky-600" />
                    <span className="text-xs text-slate-600 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12 border-t border-slate-100 pt-8">
            <div className="flex gap-6 border-b border-slate-200 mb-6">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-sky-600 text-sky-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {product.description}
                </p>
                <h4 className="font-semibold text-slate-800 mb-3">
                  Key Features
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0"></div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-lg">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b border-slate-100 text-sm"
                  >
                    <span className="text-slate-500">{key}</span>
                    <span className="text-slate-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-5">
                {[
                  {
                    name: "Alex Thompson",
                    date: "Feb 15, 2026",
                    rating: 5,
                    text: "Absolutely amazing sound quality! The noise cancellation is top-notch. Best headphones I've ever owned.",
                  },
                  {
                    name: "Priya Sharma",
                    date: "Feb 10, 2026",
                    rating: 5,
                    text: "Very comfortable for long listening sessions. Battery lasts forever. Highly recommended!",
                  },
                  {
                    name: "David Lee",
                    date: "Jan 28, 2026",
                    rating: 4,
                    text: "Great headphones overall. Sound quality is excellent. Wish they came in more colors.",
                  },
                ].map((review, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {review.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-3.5 h-3.5 ${
                              j < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
