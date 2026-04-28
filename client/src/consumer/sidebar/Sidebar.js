import React, { useContext, useEffect, useState } from 'react'
import { mainContext } from '../../App';
import { useNavigate } from 'react-router-dom';
export const Sidebar = () => {
    const {
        sideBarOpen,
        setSideBarOpen,
    } = useContext(mainContext);

    const navigate = useNavigate();

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
                ${sideBarOpen ? "w-64" : "w-16"}`}>

                <div className={`flex items-center px-4 h-16 bg-gray-900  ${sideBarOpen ? "justify-between" : "justify-center"}`}>

                    {sideBarOpen && (
                        <h1 className="text-white font-bold flex items-center gap-2">
                            <i className="fa-solid fa-truck-fast text-2xl"></i>
                            Cartify
                        </h1>
                    )}

                    {/* hamburger button */}
                    <button
                        onClick={() => setSideBarOpen(!sideBarOpen)}
                        className="text-xl text-white"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                </div>

                {/* sidebar menus */}
                <nav className="p-2 space-y-2">
                    <a href="/" className="flex items-center gap-3 px-2 py-2 text-white hover:bg-gray-700 rounded">
                        <i className="fa-solid fa-house text-2xl"></i>
                        {sideBarOpen && "Home"}
                    </a>

                    <a href="/consumers/products" className="flex items-center gap-3 px-2 py-2 text-white hover:bg-gray-700 rounded">
                        <i className="fa-solid fa-shirt text-2xl"></i>
                        {sideBarOpen && "Products"}
                    </a>

                    {loginUser && (
                        <a href="/consumers/cart" className="flex items-center gap-3 px-2 py-2 text-white hover:bg-gray-700 rounded">
                            <i className="fa-solid fa-cart-shopping text-2xl"></i>
                            {sideBarOpen && "Cart"}
                        </a>
                    )}
                </nav>
            </div>
        </div>
    )
}