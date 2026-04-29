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

    // goToPaymentPage function
    async function goToPaymentPage() {
        console.log(allDatas);
        try {
            const token = localStorage.getItem('loginToken');
            var orderData = await axios.post(`http://localhost:5000/placeOrder`, { data: allDatas }, {
                headers: {
                    Authorization: token
                }
            })
            // alert(orderData.data.message)
        } catch (error) {
            console.log("error");

        }

        navigate("/consumers/payment")
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
            else{
                navigate('/consumers/cart')
            }

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

                        <button className="text-lg text-white rounded font-bold flex items-center gap-2 bg-green-600 px-10 py-3" onClick={() => {
                            goToPaymentPage()
                        }}>
                            <i className="fa-solid fa-indian-rupee-sign"></i> {totalAmount} Pay
                        </button>
                    </div>
                )}

                {/* footer section */}
                <Footer />

            </div>


        </div>
    )
}
