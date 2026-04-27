import React, { useContext, useEffect, useState } from 'react'
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

    const [loginUser, setLoginUser] = useState(null);

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
            {open && (
                <div className={`flex-1 transition-all duration-300 ${open ? "ml-64" : "ml-0"}`}>
                    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform transition-transform duration-300 
                            ${open ? "translate-x-0" : "-translate-x-full"}`}>

                        <div className="flex items-center justify-between px-4 h-16 bg-gray-900">
                            <h1 className="text-white font-bold"> <i className="fa-solid fa-truck-fast text-2xl"></i> Cartify</h1>

                            {/* hamburger button */}
                            <button
                                onClick={() => setOpen(!open)}
                                className="text-xl text-white"
                            >
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        </div>

                        {/* sidebar menu */}
                        <nav className="p-4 space-y-2">
                            {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                                <a href="/admin/dashBoard" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                    <i className="fa-solid fa-gauge-high text-2xl"></i> Dashboard
                                </a>
                            )}
                            {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                                <a href="/admin/adminProducts" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                    <i className="fa-solid fa-shirt text-2xl"></i> Products
                                </a>
                            )}
                            {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                                <a href="/admin/consumers" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                    <i className="fa-solid fa-user text-2xl"></i> Consumers
                                </a>
                            )}
                            {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                    <i className="fa-solid fa-ranking-star text-2xl"></i> Orders
                                </a>
                            )}
                            {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                                <a href="/" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                                    <i className="fa-solid fa-chart-column text-2xl"></i> User Dashboard
                                </a>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    )
}