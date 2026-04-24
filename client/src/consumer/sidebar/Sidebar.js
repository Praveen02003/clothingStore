import React, { useContext, useEffect, useState } from 'react'
import { mainContext } from '../../App';
import { useNavigate } from 'react-router-dom';
export const Sidebar = () => {
    const {
        sideBarOpen,
        setSideBarOpen,
    } = useContext(mainContext);

    const navigate = useNavigate();

    const [loginUser, setLoginUser] = useState({});

    function openSidebar() {
        setSideBarOpen(true)
    }

    function closeSidebar() {
        setSideBarOpen(false)
    }

    function authUser() {
        var user = JSON.parse(localStorage.getItem('loginUser'))
        var token = localStorage.getItem('loginToken')
        console.log(user, "===>");

        if (user && token) {
            setLoginUser(user)
        }
    }

    useEffect(() => {
        authUser()
    }, [])


    return (
        <div>
            {/* sidebar */}
            {sideBarOpen && (
                <div>
                    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform transition-transform duration-300 
                            ${sideBarOpen ? "translate-x-0" : "-translate-x-full"}`}>

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
                            <a href="/" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-house text-2xl"></i> Home
                            </a>
                            <a href="/consumers/products" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-shirt text-2xl"></i> Products
                            </a>
                            <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-cart-shopping text-2xl"></i> Cart
                            </a>
                            <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                <i class="fa-solid fa-ranking-star text-2xl"></i> My Orders
                            </a>
                            {loginUser?.role?.toLowerCase() === "admin" && (
                                <a href="/admin/dashBoard" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                    <i class="fa-solid fa-chart-column text-2xl"></i> Admin Dashboard
                                </a>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    )
}