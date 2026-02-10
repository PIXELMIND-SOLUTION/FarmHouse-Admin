import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import VendorSidebar from "./VendorSidebar";
import VendorNavbar from "./VendorNavbar";
import VendorFarmHouse from "./VendorFarmHouse";

const VendorLayout = () => {
    const navigate = useNavigate();

    /* Protect Vendor */
    useEffect(() => {
        const isVendor = sessionStorage.getItem("isVendor");
        if (!isVendor) navigate("/vendor-login");
    }, [navigate]);

    /* Sidebar Logic */
    const [sidebarOpen, setSidebarOpen] = useState(
        window.innerWidth >= 1024
    );

    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleNavigation = (path) => {
        navigate(`/vendor${path}`);
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">

            {/* Sidebar */}
            <VendorSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={handleNavigation}
            />

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Navbar (fixed inside layout) */}
                <VendorNavbar toggleSidebar={toggleSidebar} />

                {/* ⭐ SCROLLABLE AREA */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">

                    <div
                        className="
                        rounded-2xl md:rounded-3xl
                        bg-white/90
                        backdrop-blur-xl
                        border border-white/40
                        shadow-lg
                        p-4 sm:p-6 md:p-8 lg:p-10
                        min-h-full
                        "
                    >
                        <Routes>
                            <Route path="/farmhouses" element={<VendorFarmHouse />} />

                            <Route
                                path="*"
                                element={<Navigate to="/vendor/farmhouses" />}
                            />
                        </Routes>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default VendorLayout;
