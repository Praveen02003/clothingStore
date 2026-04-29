import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import banner1 from '../../assets/banner1.jpg'
import banner2 from '../../assets/banner2.jpg'
import banner3 from '../../assets/banner3.jpg'
import axios from 'axios';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';

export const Payment = () => {

    const {
        sideBarOpen,
        setSideBarOpen,
        loginUser,
        setLoginUser
    } = useContext(mainContext);

    const navigate = useNavigate()

    const [allDatas, setAllDatas] = useState([])

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

            setAllDatas(allData)

        } catch (error) {
            console.log(error);
        }
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
        try {
            authUser()
        } catch (error) {
            console.log("error");
        }
    }, [])

    useEffect(() => {
        if (loginUser?._id) {
            getCartAll()
        }
    }, [loginUser])


    return (
        <div className={`flex-1 transition-all duration-300 
        ${sideBarOpen ? "ml-64" : "ml-16"}`}>

            {/* sidebar */}
            <Sidebar />

            <div className="flex flex-col flex-1">

                <Navbar />

                <div className="flex flex-wrap items-center justify-between gap-4 p-4">

                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <i class="fa-solid fa-credit-card"></i>
                        Payment
                    </h2>
                </div>

                <div className="flex items-center justify-center bg-gray-100 m-5">

                    <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">
                        <div className="flex justify-center mb-4">
                            <div className="text-green-600 rounded-full p-4 text-5xl">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Payment successfull
                        </h2>

                        <p className="text-gray-500 mb-6">
                            Your order has been placed successfully.
                        </p>

                        <div className="flex flex-col gap-3">

                            <button onClick={() => navigate("/")} className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
                                Back to Shopping
                            </button>

                            <a href='/consumers/myOrders' className="border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-100">
                                View My Orders
                            </a>

                        </div>

                    </div>

                </div>

                {/* footer section */}
                <Footer />

            </div>


        </div>
    )
}
