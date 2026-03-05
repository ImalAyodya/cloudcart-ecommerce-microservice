import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const adminUser = localStorage.getItem("adminUser");

  if (!token || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const user = JSON.parse(adminUser);
    if (user.role !== "admin") {
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;