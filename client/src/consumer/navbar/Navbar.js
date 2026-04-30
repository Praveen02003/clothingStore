import React, { useContext, useState } from 'react'
import { mainContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Navbar = () => {
    const {
        loginUser,
        setLoginUser,
        userProductAddModal,
        setUserProductAddModal,
    } = useContext(mainContext);


    const navigate = useNavigate()

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
        <div className="flex items-center justify-between p-6 bg-gray-700 border-b px-4">

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
                {loginUser && (
                    <div>
                        <button className="bg-red-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
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
