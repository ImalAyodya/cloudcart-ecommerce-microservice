import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
