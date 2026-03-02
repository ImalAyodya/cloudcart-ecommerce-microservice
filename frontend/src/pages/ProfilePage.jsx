import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { updateUserProfile } from "../services/userService";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Package,
  Heart,
  Settings,
  LogOut,
  CreditCard,
  ChevronRight,
  Edit3,
} from "lucide-react";

const orders = [
  {
    id: "CC-20260218-001",
    date: "Feb 18, 2026",
    status: "Delivered",
    total: "$349.97",
    items: 3,
    statusColor: "emerald",
  },
  {
    id: "CC-20260210-002",
    date: "Feb 10, 2026",
    status: "Shipped",
    total: "$129.99",
    items: 1,
    statusColor: "sky",
  },
  {
    id: "CC-20260201-003",
    date: "Feb 01, 2026",
    status: "Processing",
    total: "$89.99",
    items: 2,
    statusColor: "amber",
  },
  {
    id: "CC-20260120-004",
    date: "Jan 20, 2026",
    status: "Delivered",
    total: "$249.99",
    items: 1,
    statusColor: "emerald",
  },
];

const ProfilePage = () => {
  const { user, isAuthenticated, logout, fetchUserProfile, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, userLoading, navigate]);

  // Populate settings form when user data loads
  useEffect(() => {
    if (user) {
      setSettingsForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateUserProfile(settingsForm);
      await fetchUserProfile();
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const sidebarLinks = [
    { id: "overview", icon: User, label: "Overview" },
    { id: "orders", icon: Package, label: "My Orders" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "payment", icon: CreditCard, label: "Payment Methods" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  // Show loading while checking auth
  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/" className="hover:text-sky-400">Home</Link>
            <span>/</span>
            <span className="text-sky-400">Profile</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials()}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-sky-600 rounded-full flex items-center justify-center border-2 border-white">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-slate-800">{user.name || "User"}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user.email}
                </p>
                <p className="text-xs text-sky-600 mt-1 font-medium">
                  {user.role === "admin" ? "Admin" : "Premium Member"}
                </p>
              </div>
            </div>

            <nav className="bg-white rounded-2xl shadow-sm p-3">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    activeTab === link.id
                      ? "bg-sky-50 text-sky-600 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              ))}
              <hr className="my-2 border-slate-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Orders", value: "24", color: "sky" },
                    { label: "Wishlist Items", value: "12", color: "rose" },
                    { label: "Reward Points", value: "1,850", color: "amber" },
                    { label: "Coupons Available", value: "3", color: "emerald" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-xl shadow-sm p-5"
                    >
                      <p className="text-2xl font-bold text-slate-800">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Profile info */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-slate-800">
                      Personal Information
                    </h3>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { icon: User, label: "Full Name", value: user.name || "Not set" },
                      { icon: Mail, label: "Email", value: user.email || "Not set" },
                      { icon: Phone, label: "Phone", value: user.phone || "Not set" },
                      { icon: MapPin, label: "Address", value: user.address || "Not set" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <item.icon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{item.label}</p>
                          <p className="text-sm font-medium text-slate-700">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-slate-800">
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {order.id}
                          </p>
                          <p className="text-xs text-slate-400">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-800">
                            {order.total}
                          </p>
                          <span
                            className={`text-xs font-medium ${
                              order.statusColor === "emerald"
                                ? "text-emerald-600"
                                : order.statusColor === "sky"
                                ? "text-sky-600"
                                : "text-amber-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-5">
                  Order History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-3">
                          Order ID
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-3">
                          Date
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-3">
                          Items
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-3">
                          Total
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-3 text-sm font-medium text-slate-800">
                            {order.id}
                          </td>
                          <td className="py-3 px-3 text-sm text-slate-500">
                            {order.date}
                          </td>
                          <td className="py-3 px-3 text-sm text-slate-500">
                            {order.items} item{order.items > 1 ? "s" : ""}
                          </td>
                          <td className="py-3 px-3 text-sm font-semibold text-slate-800">
                            {order.total}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                order.statusColor === "emerald"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : order.statusColor === "sky"
                                  ? "bg-sky-100 text-sky-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-5">
                  My Wishlist
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Wireless Headphones Pro",
                      price: "$249.99",
                      image:
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
                    },
                    {
                      name: "Smart Fitness Watch",
                      price: "$199.99",
                      image:
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
                    },
                    {
                      name: "Running Shoes Ultra",
                      price: "$159.99",
                      image:
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-sm font-bold text-sky-600">
                          {item.price}
                        </p>
                      </div>
                      <button className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment */}
            {activeTab === "payment" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-5">
                  Saved Payment Methods
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      type: "Visa",
                      last4: "4532",
                      exp: "12/27",
                      isDefault: true,
                    },
                    {
                      type: "Mastercard",
                      last4: "8876",
                      exp: "08/26",
                      isDefault: false,
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        card.isDefault
                          ? "border-sky-200 bg-sky-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <CreditCard className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {card.type} ending in {card.last4}
                          </p>
                          <p className="text-xs text-slate-400">
                            Expires {card.exp}
                          </p>
                        </div>
                      </div>
                      {card.isDefault && (
                        <span className="text-xs bg-sky-600 text-white px-2.5 py-1 rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-sky-600 font-medium hover:text-sky-700">
                  + Add New Payment Method
                </button>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-5">
                  Account Settings
                </h3>

                {success && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                    <span>✓</span> {success}
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                    <span>✕</span> {error}
                  </div>
                )}

                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={settingsForm.name}
                      onChange={handleSettingsChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={settingsForm.email}
                      onChange={handleSettingsChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={settingsForm.phone}
                      onChange={handleSettingsChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={settingsForm.address}
                      onChange={handleSettingsChange}
                      placeholder="Enter your address"
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 resize-none"
                    ></textarea>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setSettingsForm({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          address: user.address || "",
                        });
                        setError("");
                        setSuccess("");
                      }}
                      className="border border-slate-200 text-slate-600 py-2.5 px-6 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
