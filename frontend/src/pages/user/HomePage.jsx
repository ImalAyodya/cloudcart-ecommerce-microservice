import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Star,
  ChevronRight,
} from "lucide-react";
import ProductCard from "../../components/user/ProductCard";

const featuredProducts = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    category: "Electronics",
    price: "249.99",
    oldPrice: "349.99",
    rating: 5,
    reviews: 128,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Premium Leather Crossbody Bag",
    category: "Fashion",
    price: "89.99",
    rating: 4,
    reviews: 64,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Minimalist Desk Lamp",
    category: "Home & Living",
    price: "59.99",
    rating: 4,
    reviews: 89,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Organic Coffee Beans 1kg",
    category: "Food & Beverages",
    price: "24.99",
    rating: 4,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Vintage Polaroid Camera",
    category: "Electronics",
    price: "129.99",
    rating: 4,
    reviews: 92,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
  },
];

const categories = [
  {
    name: "Electronics",
    count: "2,450+",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    gradient: "from-sky-600 to-sky-400",
  },
  {
    name: "Fashion",
    count: "3,800+",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    gradient: "from-rose-600 to-rose-400",
  },
  {
    name: "Home & Living",
    count: "1,200+",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    gradient: "from-amber-600 to-amber-400",
  },
  {
    name: "Sports",
    count: "980+",
    image:
      "https://images.unsplash.com/photo-1461896836934-bd45ba48b2d5?w=400&h=300&fit=crop",
    gradient: "from-emerald-600 to-emerald-400",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                New Collection 2026
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Discover Products{" "}
                <span className="bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">
                  Beyond Limits
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-lg mb-8 leading-relaxed">
                Explore our curated collection of premium products. From
                cutting-edge electronics to timeless fashion, find everything you
                need at unbeatable prices.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border border-slate-500 hover:border-sky-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-sky-500/10"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-700/50">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 border-2 border-slate-800 flex items-center justify-center text-[10px] text-white font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trusted by 50,000+ happy customers
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=500&fit=crop"
                  alt="Shopping"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Free Delivery
                  </p>
                  <p className="text-xs text-slate-400">On orders over $50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "On orders over $50",
                color: "sky",
              },
              {
                icon: ShieldCheck,
                title: "Secure Payment",
                desc: "100% protected",
                color: "emerald",
              },
              {
                icon: RefreshCw,
                title: "Easy Returns",
                desc: "30-day return policy",
                color: "amber",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                desc: "Dedicated support",
                color: "violet",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 p-4 rounded-xl"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    feature.color === "sky"
                      ? "bg-sky-100"
                      : feature.color === "emerald"
                      ? "bg-emerald-100"
                      : feature.color === "amber"
                      ? "bg-amber-100"
                      : "bg-violet-100"
                  }`}
                >
                  <feature.icon
                    className={`w-5 h-5 ${
                      feature.color === "sky"
                        ? "text-sky-600"
                        : feature.color === "emerald"
                        ? "text-emerald-600"
                        : feature.color === "amber"
                        ? "text-amber-600"
                        : "text-violet-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Shop by Category
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Browse our popular categories
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                className="group relative rounded-2xl overflow-hidden h-52"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-70`}
                ></div>
                <div className="relative h-full flex flex-col justify-end p-5 text-white">
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-sm opacity-90">{cat.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Featured Products
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Handpicked products just for you
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 to-sky-900">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative grid lg:grid-cols-2 gap-8 items-center p-10 lg:p-16">
              <div>
                <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3 mb-4">
                  Up to 50% Off on Electronics
                </h2>
                <p className="text-slate-300 mb-6 max-w-md">
                  Grab the best deals on premium electronics. Hurry, offer ends
                  soon!
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
                >
                  Shop the Sale
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden lg:flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=350&fit=crop"
                  alt="Sale"
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">
              What Our Customers Say
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Real reviews from real customers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Verified Buyer",
                text: "Amazing quality and super fast delivery! CloudCart has become my go-to for online shopping. The customer service is exceptional.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Verified Buyer",
                text: "The product selection is incredible and prices are very competitive. I've recommended CloudCart to all my friends and family.",
                rating: 5,
              },
              {
                name: "Emily Williams",
                role: "Verified Buyer",
                text: "Hassle-free returns and genuine products. I love the attention to detail in packaging. Truly a premium shopping experience.",
                rating: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {review.name}
                    </p>
                    <p className="text-xs text-slate-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
