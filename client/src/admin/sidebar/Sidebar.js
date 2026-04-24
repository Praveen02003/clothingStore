import React, { useContext } from 'react'
import { mainContext } from '../../App';
export const Sidebar = () => {
    const {
        open,
        setOpen
    } = useContext(mainContext);

    function openSidebar() {
        setOpen(true)
    }

    function closeSidebar() {
        setOpen(false)
    }
    return (
        <div>
            {/* sidebar */}
            {open && (
                <div>
                    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform transition-transform duration-300 
                            ${open ? "translate-x-0" : "-translate-x-full"}`}>

                        <div className="flex items-center justify-between px-4 h-16 bg-gray-900">
                            <h1 className="text-white font-bold"> <i class="fa-solid fa-truck-fast text-2xl"></i> Cartify</h1>

                            <button
                                className="text-white"
                                onClick={() => closeSidebar()}>
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* sidebar menu */}
                        <nav className="p-4 space-y-2">
                            <a href="/admin/dashBoard" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-gauge-high text-2xl"></i> Dashboard
                            </a>
                            <a href="/admin/adminProducts" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-shirt text-2xl"></i> Products
                            </a>
                            <a href="/admin/consumers" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-user text-2xl"></i> Consumers
                            </a>
                            <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-ranking-star text-2xl"></i> Orders
                            </a>
                            <a href="/" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-chart-column text-2xl"></i> User Dashboard
                            </a>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    )
}