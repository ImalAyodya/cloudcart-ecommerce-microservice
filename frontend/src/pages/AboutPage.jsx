import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Users,
  Award,
  TrendingUp,
  Globe,
  ArrowRight,
  User,
} from "lucide-react";
import logo from "../images/logo.jpeg";

const team = [
  {
    name: "Sithmaka Nanayakkara",
    role: "Full Stack Developer",
    // image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Pasan Amarasinghe",
    role: "Full Stack Developer",
    // image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Malmi Bandara",
    role: "Full Stack Developer",
    // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Imal Ayodya",
    role: "Full Stack Developer",
    // image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

const stats = [
  { value: "10K+", label: "Products", icon: TrendingUp },
  { value: "50K+", label: "Customers", icon: Users },
  { value: "15+", label: "Countries", icon: Globe },
  { value: "99%", label: "Satisfaction", icon: Award },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">About CloudCart</h1>
          <p className="text-sky-200 max-w-2xl mx-auto">
            We're on a mission to make online shopping accessible, enjoyable,
            and reliable for everyone.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-300 mt-4">
            <Link to="/home" className="hover:text-sky-400">Home</Link>
            <span>/</span>
            <span className="text-sky-400">About Us</span>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sky-600 text-sm font-semibold uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-5">
                Building the Future of E-Commerce
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Founded in 2024 by a team of passionate SLIIT graduates,
                CloudCart was born from a simple idea: everyone deserves access
                to quality products at fair prices with a seamless shopping
                experience.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                What started as a small online store has grown into a thriving
                marketplace serving thousands of customers across Sri Lanka and
                beyond. We leverage cutting-edge microservice architecture to
                ensure fast, reliable, and scalable service delivery.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  Explore Products <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border border-slate-300 hover:border-sky-500 text-slate-700 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop"
                alt="Team"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-5 flex items-center gap-3">
                <img
                  src={logo}
                  alt="CloudCart"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">Since 2024</p>
                  <p className="text-xs text-slate-500">
                    Trusted E-Commerce Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-sky-600" />
                </div>
                <div className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-2xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-sky-100 leading-relaxed">
                To democratize online shopping by providing a platform that
                connects quality sellers with discerning buyers, ensuring every
                transaction is seamless, secure, and satisfying. We strive to
                make premium products accessible to everyone.
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed">
                To become South Asia's most trusted and innovative e-commerce
                platform, setting new standards in customer experience, product
                quality, and technological excellence. We aim to shape the future
                of digital commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">
              Our Core Values
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Customer First",
                desc: "Every decision we make starts with our customers. Their satisfaction is our top priority and the measure of our success.",
                color: "sky",
              },
              {
                title: "Quality Assurance",
                desc: "We rigorously vet every product and seller to ensure only the highest quality items reach our customers.",
                color: "emerald",
              },
              {
                title: "Innovation",
                desc: "We continuously push boundaries with cutting-edge technology to deliver the best shopping experience possible.",
                color: "violet",
              },
              {
                title: "Transparency",
                desc: "Honest pricing, clear policies, and open communication form the foundation of trust with our community.",
                color: "amber",
              },
              {
                title: "Sustainability",
                desc: "We're committed to eco-friendly practices, from packaging to partnerships, reducing our environmental footprint.",
                color: "emerald",
              },
              {
                title: "Community",
                desc: "We believe in giving back and actively support local businesses, artisans, and community initiatives.",
                color: "rose",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                    value.color === "sky"
                      ? "bg-sky-100"
                      : value.color === "emerald"
                      ? "bg-emerald-100"
                      : value.color === "violet"
                      ? "bg-violet-100"
                      : value.color === "amber"
                      ? "bg-amber-100"
                      : "bg-rose-100"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      value.color === "sky"
                        ? "bg-sky-500"
                        : value.color === "emerald"
                        ? "bg-emerald-500"
                        : value.color === "violet"
                        ? "bg-violet-500"
                        : value.color === "amber"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  ></div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">
              Meet Our Team
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              The talented people behind CloudCart
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="text-center bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow"
              >
                {/* <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-slate-50"
                /> */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mx-auto mb-4 ring-4 ring-slate-50">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800">
                  {member.name}
                </h4>
                <p className="text-sm text-sky-600 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-sky-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-sky-100 mb-8 max-w-lg mx-auto">
            Join thousands of happy customers and discover amazing products at
            unbeatable prices.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-sky-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-sky-50 transition-colors"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
