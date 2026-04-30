import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import axios from 'axios';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';

export const Billing = () => {

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

    // goToPaymentPage function
    async function goToPaymentPage() {
        setSpinnerLoader(true)
        console.log(allDatas);
        try {
            const token = localStorage.getItem('loginToken');
            var addressDetails = JSON.parse(localStorage.getItem('updatedAddress'))
            var orderData = await axios.post(`http://localhost:5000/placeOrder`, { data: allDatas, address: addressDetails }, {
                headers: {
                    Authorization: token
                }
            })
            // alert(orderData.data.message)
            if (orderData.data.message === "order placed") {
                setSpinnerLoader(false)
                localStorage.removeItem("updatedAddress")
                navigate("/consumers/payment")
            }
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

                {/* billing card section */}

                <div className="flex flex-wrap items-center justify-between gap-4 p-4">

                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <i class="fa-solid fa-receipt"></i>
                        Bill Information
                    </h2>
                </div>

                <div className="bg-white items-center shadow-lg rounded-xl p-6 w-full">

                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Billing Details
                    </h2>

                    <div className='flex justify-center items-center'>

                        <div className='justify-between w-full max-w-md'>
                            <div className="max-h-64 overflow-y-auto">

                                {allDatas.length > 0 ? (
                                    allDatas.map((data, index) => {
                                        const product = data.product[0];

                                        return (
                                            <div key={index} className="flex justify-between items-center border-b py-2">

                                                <div>
                                                    <p className="font-semibold">{product?.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        quantity: {data.quantity} x <i class="fa-solid fa-dollar-sign"></i> {product?.price}
                                                    </p>
                                                </div>

                                                <div className="font-bold text-gray-800">
                                                    <i class="fa-solid fa-dollar-sign"></i> {product?.price * data.quantity}
                                                </div>

                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-red-500 font-bold py-4">
                                        No Items to bill
                                    </p>
                                )}

                            </div>

                            <div className="flex justify-between items-center mt-4 border-t pt-4">
                                <h3 className="text-lg font-bold">Total</h3>
                                <h3 className="text-lg font-bold text-green-600">
                                    <i class="fa-solid fa-dollar-sign"></i> {totalAmount}
                                </h3>
                            </div>

                            <div className="flex flex-col gap-3 mt-6">

                                <button
                                    onClick={() => {
                                        goToPaymentPage()
                                    }}
                                    className="bg-gray-700 text-white py-2 rounded-lg font-semibold"
                                >
                                    Pay <i class="fa-solid fa-dollar-sign"></i>{totalAmount}
                                </button>

                                <button
                                    onClick={() => navigate("/")}
                                    className="border py-2 rounded-lg font-semibold"
                                >
                                    Back to home
                                </button>

                                <a
                                    href="/consumers/myOrders"
                                    className="text-center border py-2 rounded-lg font-semibold"
                                >
                                    View my orders
                                </a>

                            </div>
                        </div>
                    </div>


                </div>


                {/* footer section */}
                <Footer />

            </div>


        </div>
    )
}
