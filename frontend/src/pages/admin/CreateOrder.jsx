import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";

const CreateOrder = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Sample data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com" },
  ];

  const products = [
    { id: 1, name: "Wireless Headphones", price: 79.99, stock: 45 },
    { id: 2, name: "Smart Watch Pro", price: 199.99, stock: 23 },
    { id: 3, name: "Laptop Stand", price: 49.99, stock: 67 },
    { id: 4, name: "Wireless Mouse", price: 34.99, stock: 89 },
  ];

  const addProduct = (product) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === product.id ? { ...p, qty: p.qty + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, qty: 1 }]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty < 1) {
      removeProduct(productId);
    } else {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === productId ? { ...p, qty } : p
      ));
    }
  };

  const total = selectedProducts.reduce((sum, p) => sum + (p.price * p.qty), 0);

  const handleSubmit = () => {
    // This would trigger the full order flow
    console.log("Creating order:", { userId: selectedUser, products: selectedProducts });
    alert("Order created successfully! (Demo - No backend integration)\n\nThe Order Service would call:\n1. User Service - Validate user\n2. Product Service - Check availability\n3. Payment Service - Process payment\n4. Product Service - Reduce stock");
    navigate("/admin/orders");
  };

  const steps = [
    { num: 1, title: "Select Customer", service: "User Service" },
    { num: 2, title: "Add Products", service: "Product Service" },
    { num: 3, title: "Review & Pay", service: "Payment Service" },
  ];

  return (
    <div>
      <AdminHeader title="Create New Order" />

      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <RouterLink to="/admin/orders" className="hover:text-purple-600">Order Management</RouterLink>
          <span>/</span>
          <span className="text-slate-800">Create Order</span>
        </div>

        {/* Order Flow Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-2">Order Creation Flow</h3>
          <p className="text-sm text-purple-600">
            This demonstrates the CORE functionality of Order Service - orchestrating calls to User, Product, and Payment services.
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.num} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentStep === step.num ? "bg-purple-600 text-white" :
                currentStep > step.num ? "bg-emerald-100 text-emerald-700" :
                "bg-slate-100 text-slate-500"
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === step.num ? "bg-white text-purple-600" :
                  currentStep > step.num ? "bg-emerald-600 text-white" :
                  "bg-slate-300 text-white"
                }`}>
                  {currentStep > step.num ? "✓" : step.num}
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs opacity-75">{step.service}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step.num ? "bg-emerald-400" : "bg-slate-200"
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Customer */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                  <span className="font-mono text-sm text-blue-800">/users/validate/{"{userId}"}</span>
                </div>
                <p className="text-sm text-blue-600 mt-2">Order Service calls User Service to validate customer</p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Customer</h3>
                <div className="space-y-3">
                  {users.map((user) => (
                    <label
                      key={user.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedUser === user.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="user"
                        value={user.id}
                        checked={selectedUser === user.id}
                        onChange={() => setSelectedUser(user.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="ml-4">
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedUser}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Select Products
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Add Products */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 bg-emerald-50">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                  <span className="font-mono text-sm text-emerald-800">/products/{"{id}"}/availability</span>
                </div>
                <p className="text-sm text-emerald-600 mt-2">Order Service calls Product Service to check stock availability</p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Available Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="text-sm text-emerald-600 font-semibold">${product.price}</p>
                        <p className="text-xs text-slate-500">Stock: {product.stock}</p>
                      </div>
                      <button
                        onClick={() => addProduct(product)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>

                {selectedProducts.length > 0 && (
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="font-semibold text-slate-800 mb-4">Selected Products</h4>
                    <div className="space-y-3">
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-800">{product.name}</p>
                            <p className="text-sm text-slate-500">${product.price} each</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(product.id, product.qty - 1)}
                                className="w-8 h-8 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">{product.qty}</span>
                              <button
                                onClick={() => updateQuantity(product.id, product.qty + 1)}
                                className="w-8 h-8 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <p className="font-semibold w-20 text-right">${(product.price * product.qty).toFixed(2)}</p>
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={selectedProducts.length === 0}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Review & Pay
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Pay */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                  <span className="font-mono text-sm text-orange-800">/payments/process</span>
                </div>
                <p className="text-sm text-orange-600 mt-2">Order Service calls Payment Service to process the payment</p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h3>
                
                {/* Customer Info */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-500 mb-1">Customer</p>
                  <p className="font-medium text-slate-800">
                    {users.find(u => u.id === selectedUser)?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {users.find(u => u.id === selectedUser)?.email}
                  </p>
                </div>

                {/* Products */}
                <div className="space-y-3 mb-6">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="text-sm text-slate-500">Qty: {product.qty} × ${product.price}</p>
                      </div>
                      <p className="font-semibold text-slate-800">${(product.price * product.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-purple-50 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-purple-800">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-600">${total.toFixed(2)}</span>
                </div>

                {/* Final API Call Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-2">After Payment Success:</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                    <span className="font-mono text-sm text-blue-800">/products/{"{id}"}/reduce-stock</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Order Service calls Product Service to reduce inventory</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Place Order (${total.toFixed(2)})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
