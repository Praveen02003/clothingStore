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
            <div
                className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 transform ${open ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 transition-transform duration-300 z-50`}
            >
                <div className="flex items-center justify-between px-4 h-16 bg-gray-900">
                    <h1 className="text-white font-bold">Clothing Store</h1>

                    <button
                        className="text-white md:hidden"
                        onClick={() => closeSidebar()}>
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* sidebar menu */}
                <nav className="p-4 space-y-2">
                    <a href="/admin/dashBoard" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                        Dashboard
                    </a>
                    <a href="/admin/adminProducts" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                        Products
                    </a>
                    <a href="/admin/consumers" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                        Consumers
                    </a>
                    <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                        Categories
                    </a>
                    <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                        Orders
                    </a>
                    <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                        User Dashboard
                    </a>
                    <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                        Log Out
                    </a>

                </nav>
            </div>

            {open && (
                <div
                    className="fixed inset-0 bg-black opacity-40 md:hidden z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </div>
    )
}