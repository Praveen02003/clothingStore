import React, { useContext, useEffect, useState } from 'react'
import { mainContext } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
export const Sidebar = () => {
    const {
        sideBarOpen,
        setSideBarOpen,
        cartCount,
        setCartCount
    } = useContext(mainContext);

    const navigate = useNavigate();

    var location = useLocation();

    const [loginUser, setLoginUser] = useState(null);

    const [allDatas, setAllDatas] = useState([])

    function authUser() {
        var user = JSON.parse(localStorage.getItem('loginUser'))
        var token = localStorage.getItem('loginToken')
        console.log(user, "===>");

        if (user && token) {
            setLoginUser(user)
        }
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('consumerSidebarOpen')
        setLoginUser(null)
        navigate('/login')
    }


    // getCartAll function
    async function getCartAll() {
        try {
            const token = localStorage.getItem('loginToken');
            var getData = await axios.get(`http://localhost:5000/getCart/${loginUser._id}`, {
                headers: {
                    Authorization: token
                }
            })

            var allData = getData.data.data
            console.log(allData);
            setCartCount(allData.length)
            setAllDatas(allData)
        } catch (error) {
            console.log(error.response.data.message);
            // alert(error.response.data.message)
            if (error.response.data.message === "Access denied") {
                logOut()
            }
            else if (error.response.data.message === "Invalid token") {
                logOut()
            }
        }
    }

    useEffect(() => {
        if (loginUser?._id) {
            getCartAll()
        }
    }, [loginUser])

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
                        onClick={() => {
                            const trackSideBar = !sideBarOpen;
                            setSideBarOpen(trackSideBar)
                            localStorage.setItem("consumerSidebarOpen", JSON.stringify(trackSideBar));
                        }}
                        className="text-xl text-white"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                </div>

                {/* sidebar menus */}
                <nav className="p-2 space-y-2">
                    <a href="/" className={`flex items-center gap-3 px-2 py-2 text-white ${location.pathname === "/" ? "bg-gray-600" : ""} rounded`}>
                        <i className="fa-solid fa-house text-2xl"></i>
                        {sideBarOpen && "Home"}
                    </a>

                    <a href="/consumers/products" className={`flex items-center gap-3 px-2 py-2 text-white ${location.pathname === "/consumers/products" ? "bg-gray-600" : ""} rounded`}>
                        <i className="fa-solid fa-shirt text-2xl"></i>
                        {sideBarOpen && "Products"}
                    </a>

                    {loginUser && (
                        <a href="/consumers/cart" className={`flex items-center gap-3 px-2 py-2 text-white ${location.pathname === "/consumers/cart" ? "bg-gray-600" : ""} rounded`}>
                            <div className="relative">
                                <i className="fa-solid fa-cart-shopping text-2xl"></i>

                                <span className="absolute top-3 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                                    {cartCount}
                                </span>
                            </div>

                            {sideBarOpen && "Cart"}
                        </a>
                    )}
                    {loginUser && (
                        <a href="/consumers/myProducts" className={`flex items-center gap-3 px-2 py-2 text-white ${location.pathname === "/consumers/myProducts" ? "bg-gray-600" : ""} rounded`}>
                            <i class="fa-solid fa-chart-simple text-2xl"></i>
                            {sideBarOpen && "My Products"}
                        </a>
                    )}
                    {loginUser && (
                        <a href="/consumers/myOrders" className={`flex items-center gap-3 px-2 py-2 text-white ${location.pathname === "/consumers/myOrders" ? "bg-gray-600" : ""} rounded`}>
                            <i class="fa-solid fa-folder-closed text-2xl"></i>
                            {sideBarOpen && "My Orders"}
                        </a>
                    )}
                </nav>
            </div>
        </div>
    )
}