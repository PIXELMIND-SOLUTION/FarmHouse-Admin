import React from "react";
import { useLocation } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const VendorSidebar = ({ sidebarOpen, setSidebarOpen, onNavigate }) => {
    const location = useLocation();

    const menu = [
        { name: "Farmhouses", icon: <FiHome />, path: "/farmhouses" },
    ];

    return (
        <>
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            <div className={`fixed lg:relative z-50 h-screen transition-all duration-300 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 w-72`}>

                <div className="h-full m-3 rounded-3xl bg-white border border-lime-200 shadow-2xl overflow-hidden flex flex-col">

                    <div className="p-6 text-2xl font-extrabold text-lime-800 border-b bg-gradient-to-r from-lime-100 to-amber-100">
                        Vendor Panel
                    </div>

                    <div className="p-3 space-y-2 flex-1">
                        {menu.map((item) => {
                            const active = location.pathname.includes(item.path);

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => onNavigate(item.path)}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200
                                    ${active
                                            ? "bg-gradient-to-r from-lime-500 to-amber-500 text-white shadow-md"
                                            : "hover:bg-lime-100 text-lime-800"
                                        }`}
                                >
                                    {item.icon}
                                    <span className="font-semibold">{item.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VendorSidebar;
