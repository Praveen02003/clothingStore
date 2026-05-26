import React, { useContext, useEffect, useState } from 'react'
import { mainContext } from '../../App';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const {
        loginUser,
        setLoginUser,
        userProductAddModal,
        setUserProductAddModal,
        displayModeContent,
        setDisplayModeContent
    } = useContext(mainContext);

    const navigate = useNavigate()

    // darkMode function 
    function darkMode() {
        var getTheme = (displayModeContent === "Light") ? "Dark" : "Light"
        setDisplayModeContent(getTheme)
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('consumerSidebarOpen')
        setLoginUser(null)
        navigate('/login')
    }

    // goToLoginPage function
    function goToLoginPage() {
        navigate('/login')
    }

    // goToSignupPage function
    function goToSignupPage() {
        navigate('/signup')
    }

    return (
        <div className={`flex items-center justify-between p-6 ${displayModeContent === "Light" ? 'bg-gray-700' : 'bg-gray-800'} border-b px-4`}>
            <div className="flex items-center gap-4">
                <h1 className="text-white font-bold"> <i className="fa-solid fa-truck-fast text-2xl"></i> Cartify</h1>
            </div>

            {/* logout button */}
            <div className="flex items-center gap-2">
                {!loginUser && (
                    <div>
                        <button className="bg-blue-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                            goToSignupPage()
                        }}>
                            <i className="fa-solid fa-user-plus"></i> Signup
                        </button>
                        <button className="bg-blue-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                            goToLoginPage()
                        }}>
                            Login
                        </button>
                    </div>
                )}

                <div>
                    <button className="bg-white rounded text-black font-bold px-5 py-1" onClick={() => {
                        darkMode()
                    }}>
                        {displayModeContent === "Light"
                            ?
                            <div>
                                <i className="fa-solid fa-moon text-xl"></i> Dark
                            </div>
                            :
                            <div>
                                <i className="fa-regular fa-moon text-xl"></i> Light
                            </div>}
                    </button>
                </div>

                {loginUser && (
                    <div>
                        <button className={`${displayModeContent === "Light" ? 'bg-red-500' : 'bg-red-600'} px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4`} onClick={() => {
                            logOut()
                        }}>
                            <i className="fa-solid fa-right-from-bracket"></i> Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
