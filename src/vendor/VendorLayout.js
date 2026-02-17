import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import VendorSidebar from "./VendorSidebar";
import VendorNavbar from "./VendorNavbar";
import VendorFarmHouse from "./VendorFarmHouse";

const VendorLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isVendor = sessionStorage.getItem("isVendor");
        if (!isVendor) navigate("/vendor-login");
    }, [navigate]);

    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleNavigation = (path) => {
        navigate(`/vendor${path}`);
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-lime-50 via-amber-50 to-lime-100">

            <VendorSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={handleNavigation}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <VendorNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
                    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-lime-200 shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 min-h-full">
                        <Routes>
                            <Route path="/farmhouses" element={<VendorFarmHouse />} />
                            <Route path="*" element={<Navigate to="/vendor/farmhouses" />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VendorLayout;
