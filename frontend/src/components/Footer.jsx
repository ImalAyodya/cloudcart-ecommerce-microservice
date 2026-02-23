import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import logo from "../images/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-sky-700 to-sky-600">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-sky-100 text-sm mt-1">
              Get the latest deals and updates delivered to your inbox.
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-l-lg text-sm text-slate-800 w-full md:w-72 focus:outline-none"
            />
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-r-lg text-sm font-medium flex items-center gap-2 transition-colors">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/home" className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="CloudCart"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <span className="text-lg font-bold text-white">CloudCart</span>
                <p className="text-[10px] text-slate-400 -mt-1 tracking-wider">
                  Shop Beyond Limits
                </p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Your one-stop destination for premium products at unbeatable
              prices. Quality guaranteed with every purchase.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Home", path: "/home" },
                { name: "Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "Contact Us", path: "/contact" },
                { name: "My Profile", path: "/profile" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {[
                "Electronics",
                "Fashion",
                "Home & Living",
                "Sports & Outdoors",
                "Books & Media",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/products"
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <span>
                  SLIIT Malabe Campus, New Kandy Road, Malabe, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+94 76 433 5055</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>support@cloudcart.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>&copy; 2026 CloudCart. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-sky-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-sky-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-sky-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
