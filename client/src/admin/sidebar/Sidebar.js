import React, { useContext, useEffect, useState } from 'react'
import { mainContext } from '../../App';
import { useLocation } from 'react-router-dom';
export const Sidebar = () => {
    const {
        open,
        setOpen
    } = useContext(mainContext);

    var location = useLocation()

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
            <div className={`fixed top-0 left-0 h-full bg-gray-800 z-50 
                transition-all duration-300 
                ${open ? "w-64" : "w-16"}`}>

                <div className={`flex items-center h-16 bg-gray-900 transition-all duration-300
                    ${open ? "justify-between px-4" : "justify-center"}`}>

                    {open && (
                        <h1 className="text-white font-bold flex items-center gap-2">
                            <i className="fa-solid fa-truck-fast text-2xl"></i>
                            Cartify
                        </h1>
                    )}

                    <button
                        onClick={() => {
                            const trackSideBar = !open;
                            setOpen(trackSideBar);
                            localStorage.setItem("sidebarOpen", JSON.stringify(trackSideBar));
                        }}
                        className="text-xl text-white"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>

                {/* sidebar menus */}
                <nav className="mt-4 space-y-2">

                    {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                        <a href="/admin/dashBoard"
                            className={`flex items-center py-2 text-white ${location.pathname === "/admin/dashBoard" ? "bg-gray-600" : ""} ${location.pathname === "/admin/dashBoard" ? "bg-gray-600" : ""} rounded
                                ${open ? "px-4 gap-3" : "justify-center"}`}>

                            <i className="fa-solid fa-gauge-high text-2xl"></i>
                            {open && "Dashboard"}
                        </a>
                    )}

                    {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                        <a href="/admin/adminProducts"
                            className={`flex items-center py-2 text-white ${location.pathname === "/admin/adminProducts" ? "bg-gray-600" : ""} rounded
                                    ${open ? "px-4 gap-3" : "justify-center"}`}>

                            <i className="fa-solid fa-shirt text-2xl"></i>
                            {open && "Products"}
                        </a>
                    )}

                    {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                        <a href="/admin/consumers"
                            className={`flex items-center py-2 text-white ${location.pathname === "/admin/consumers" ? "bg-gray-600" : ""} rounded
                                ${open ? "px-4 gap-3" : "justify-center"}`}>

                            <i className="fa-solid fa-user text-2xl"></i>
                            {open && "Consumers"}
                        </a>
                    )}
                    {(loginUser && loginUser.role.toLowerCase() === "admin") && (
                        <a href="/admin/orders"
                            className={`flex items-center py-2 text-white ${location.pathname === "/admin/orders" ? "bg-gray-600" : ""} rounded
                                ${open ? "px-4 gap-3" : "justify-center"}`}>

                            <i class="fa-regular fa-folder-open text-2xl"></i>
                            {open && "Orders"}
                        </a>
                    )}
                </nav>
            </div>
        </div>
    )
}