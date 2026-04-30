import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import axios from 'axios';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';

export const Checkout = () => {

    const {
        sideBarOpen,
        setSideBarOpen,
        loginUser,
        setLoginUser
    } = useContext(mainContext);

    const navigate = useNavigate()

    const [allDatas, setAllDatas] = useState([])

    const [totalAmount, setTotalAmount] = useState(0)

    const [spinnerLoader, setSpinnerLoader] = useState(false);

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('consumerSidebarOpen')
        setLoginUser(null)
        navigate('/login')
    }


    // goToFinalCheckoutPage function
    function goToFinalCheckoutPage() {
        navigate("/consumers/addressDetails")
    }

    // calculateTotalAmount function
    function calculateTotalAmount(cartData) {
        let total = 0;

        cartData.forEach((item) => {
            const product = item.product[0];
            const price = product?.price || 0;
            const quantity = item.quantity || 0;

            total += price * quantity;
        });

        setTotalAmount(total);
    }

    // getCartAll function
    async function getCartAll() {
        setSpinnerLoader(true)
        try {
            const token = localStorage.getItem('loginToken');
            var getData = await axios.get(`http://localhost:5000/getCart/${loginUser._id}`, {
                headers: {
                    Authorization: token
                }
            })

            var allData = getData.data.data
            console.log(allData);

            if (allData.length > 0) {
                setAllDatas(allData)
                calculateTotalAmount(allData)
            }
            else {
                navigate('/consumers/cart')
            }
            setSpinnerLoader(false)

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


            {spinnerLoader && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                </div>
            )}

            <div className="flex flex-col flex-1">

                <Navbar />

                <div className="flex flex-wrap items-center justify-between gap-4 p-4">

                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <i class="fa-solid fa-basket-shopping"></i>
                        Checkout
                    </h2>
                </div>

                <div className="p-4">
                    <div className="max-h-96 overflow-y-auto overflow-x-auto shadow-md rounded-lg">

                        <table className="w-full text-sm text-left text-gray-500">

                            <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                                <tr className='text-center'>
                                    <th className="px-6 py-3">S.no</th>
                                    <th className="px-6 py-3">Product Name</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Offer</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allDatas.length > 0 ? (
                                    allDatas.map((data, index) => {
                                        const product = data.product[0];

                                        return (
                                            <tr key={index} className="bg-white text-center border-b hover:bg-gray-50">

                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {index + 1}
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {product?.name}
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    <i className="fa-solid fa-indian-rupee-sign"></i> {product?.price}
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-blue-600">
                                                    {product?.offer} <i className="fa-solid fa-percent"></i>
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-green-600">
                                                    {product?.category}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-green-600">
                                                    {data.quantity}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6 text-red-500 font-bold">
                                            No Items in the Cart
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>

                    </div>
                </div>

                {totalAmount > 0 && (
                    <div className="flex flex-wrap items-center justify-end gap-4 p-4">

                        <button className="text-lg text-white rounded font-bold flex items-center gap-2 bg-gray-700 px-10 py-3" onClick={() => {
                            goToFinalCheckoutPage()
                        }}>
                            <i class="fa-solid fa-dollar-sign"></i> {totalAmount} Final Payment
                        </button>
                    </div>
                )}

                {/* footer section */}
                <Footer />

            </div>


        </div>
    )
}
