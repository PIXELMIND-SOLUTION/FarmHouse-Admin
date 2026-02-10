import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";

import VendorLogin from "./vendor/VendorLogin";
import VendorLayout from "./vendor/VendorLayout";

function App() {
  return (
    <Routes>
      {/* Admin */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminPanel />} />

      {/* Vendor */}
      <Route path="/vendor-login" element={<VendorLogin />} />
      <Route path="/vendor/*" element={<VendorLayout />} />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
