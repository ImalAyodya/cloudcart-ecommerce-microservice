import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  FileQuestion,
} from "lucide-react";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent. We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-sky-200 max-w-2xl mx-auto">
            Have a question or need help? We'd love to hear from you. Our team
            is always ready to assist.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-300 mt-4">
            <Link to="/home" className="hover:text-sky-400">Home</Link>
            <span>/</span>
            <span className="text-sky-400">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Quick contact cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-20">
            {[
              {
                icon: Phone,
                title: "Call Us",
                detail: "+94 11 234 5678",
                sub: "Mon-Fri, 9AM-6PM",
                color: "sky",
              },
              {
                icon: Mail,
                title: "Email Us",
                detail: "support@cloudcart.com",
                sub: "We reply within 24 hours",
                color: "emerald",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                detail: "SLIIT Malabe Campus",
                sub: "New Kandy Road, Malabe",
                color: "violet",
              },
              {
                icon: Clock,
                title: "Working Hours",
                detail: "Mon - Fri: 9AM - 6PM",
                sub: "Sat: 10AM - 4PM",
                color: "amber",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    card.color === "sky"
                      ? "bg-sky-100"
                      : card.color === "emerald"
                      ? "bg-emerald-100"
                      : card.color === "violet"
                      ? "bg-violet-100"
                      : "bg-amber-100"
                  }`}
                >
                  <card.icon
                    className={`w-6 h-6 ${
                      card.color === "sky"
                        ? "text-sky-600"
                        : card.color === "emerald"
                        ? "text-emerald-600"
                        : card.color === "violet"
                        ? "text-violet-600"
                        : "text-amber-600"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  {card.title}
                </h3>
                <p className="text-sm font-medium text-slate-700">
                  {card.detail}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form + Map */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Send Us a Message
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Fill out the form below and we'll respond as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
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
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="return">Return & Refund</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Map + FAQ */}
            <div className="space-y-6">
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-72">
                <iframe
                  title="CloudCart Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.547803780858!2d79.97069!3d6.914682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256db1a6771c5%3A0x2c63e344ab9a7536!2sSLIIT%20Malabe%20Campus!5e0!3m2!1sen!2slk!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>

              {/* FAQ Quick links */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">
                  Quick Help
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      icon: MessageSquare,
                      title: "Live Chat",
                      desc: "Chat with our support team in real-time",
                    },
                    {
                      icon: Headphones,
                      title: "Phone Support",
                      desc: "Speak directly with a customer care agent",
                    },
                    {
                      icon: FileQuestion,
                      title: "FAQ Center",
                      desc: "Find answers to commonly asked questions",
                    },
                  ].map((item) => (
                    <button
                      key={item.title}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-sky-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
