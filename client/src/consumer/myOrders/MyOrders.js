import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import axios from 'axios';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';

export const MyOrders = () => {

    const {
        sideBarOpen,
        setSideBarOpen,
        loginUser,
        setLoginUser
    } = useContext(mainContext);

    const navigate = useNavigate()

    const [myOrderDatas, setMyOrderDatas] = useState([])

    const [getParticularOrder, setGetParticularOrder] = useState({})

    const [viewOrderModal, setViewOrderModal] = useState(false)

    const [totalPrice, setTotalPrice] = useState(0)

    const [spinnerLoader, setSpinnerLoader] = useState(false);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [dynamicPageNumber, setDynamicPageNumber] = useState(5);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [startValue, setStartValue] = useState(0);
    const [endValue, setEndValue] = useState(0);

    // next function
    function next() {
        setCurrentPage(currentPage + 1)
    }

    // previous function
    function previous() {
        setCurrentPage(currentPage - 1)
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('consumerSidebarOpen')
        setLoginUser(null)
        navigate('/login')
    }

    // getMyOrders function
    async function getMyOrders() {
        setSpinnerLoader(true)
        try {
            const token = localStorage.getItem('loginToken');
            var getData = await axios.get(`http://localhost:5000/getMyOrders/${loginUser._id}?page=${currentPage}&count=${dynamicPageNumber}`, {
                headers: {
                    Authorization: token
                }
            })

            // pagination concept
            var allData = getData.data.data
            console.log(allData);

            var totalNumberOfData = getData.data.totalPage
            var totalPagesData = Math.ceil(getData.data.totalPage / dynamicPageNumber)

            var calculateStart = (currentPage - 1) * dynamicPageNumber + 1
            var calculateEnd = (parseInt(calculateStart) + parseInt(dynamicPageNumber)) - 1

            setStartValue(calculateStart)
            setEndValue(calculateEnd)
            setMyOrderDatas(allData)
            setTotalPages(totalPagesData)
            setTotalDataCount(totalNumberOfData)
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
    // goToCheckOutPage function
    function goToCheckOutPage() {
        navigate("/consumers/checkOut")
    }

    // authUser function
    function authUser() {
        var user = JSON.parse(localStorage.getItem('loginUser'))
        var token = localStorage.getItem('loginToken')
        console.log(user, "===>");

        if (user && token) {
            setLoginUser(user)
        }
    }

    // viewOrder function
    async function viewOrder(id) {
        setSpinnerLoader(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await getParticularOrderDetails(id)
            setViewOrderModal(true)
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoader(false);
        }
    }

    // deleteOrder function
    async function deleteOrder(id) {
        setSpinnerLoader(true)
        try {
            const token = localStorage.getItem('loginToken');
            var datas = {
                id: id
            }
            var orderDelete = await axios.post(`http://localhost:5000/deleteOrder`, { data: datas }, {
                headers: {
                    Authorization: token
                }
            });
            console.log(orderDelete.data.message);
            if (orderDelete.data.message === "order deleted successfully") {
                getMyOrders()
                setSpinnerLoader(false)
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

    async function getParticularOrderDetails(id) {
        try {
            const token = localStorage.getItem('loginToken');
            var getData = await axios.get(`http://localhost:5000/getParticularOrder/${id}`, {
                headers: {
                    Authorization: token
                }
            })

            var allData = getData.data.data[0]
            console.log(allData);

            setSpinnerLoader(false)
            setViewOrderModal(true)
            setGetParticularOrder(allData)
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
        try {
            authUser()
        } catch (error) {
            console.log("error");
        }
    }, [])

    useEffect(() => {
        if (loginUser?._id) {
            getMyOrders()
        }
    }, [loginUser, currentPage, dynamicPageNumber])

    return (
        <div
            className={`flex-1 transition-all duration-300 
                ${sideBarOpen ? "ml-64" : "ml-16"}`} >

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
                        <i className="fa-solid fa-folder-closed"></i>
                        My Orders
                    </h2>
                </div>

                {/* orders table */}
                <div className="p-4">
                    <div className="max-h-100 overflow-y-auto overflow-x-auto shadow-md rounded-lg bg-white">

                        <table className="w-full text-sm text-left">

                            <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                                <tr className="text-center bg-gray-600 text-white">
                                    <th className="px-6 py-3">S.no</th>
                                    <th className="px-6 py-3">Customer Name</th>
                                    <th className="px-6 py-3">Ordered Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Total Items</th>
                                    <th className="px-6 py-3">Total Price</th>
                                    <th className="px-6 py-3">Shipping Address</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {myOrderDatas.length > 0 ? myOrderDatas.map((data, index) => {
                                    var user = data.orderUser[0]
                                    return (
                                        <tr className="bg-white text-center border-b font-bold" key={index}>
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{user.firstName}.{user.lastName}</td>
                                            <td className="px-6 py-4">{new Date(data.addedOn).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-semibold">{data.status}</td>
                                            <td className="px-6 py-4">{data.orderProduct?.length}</td>
                                            <td className="px-6 py-4">
                                                <i class="fa-solid fa-dollar-sign"></i> {data.orderHistory.reduce((acc, item) => acc + item.totalPrice, 0)}
                                            </td>
                                            <td className="px-6 py-4">{data.shippingAddress}</td>
                                            <td className="px-6 py-4">
                                                <button className="text-black me-5 font-bold hover:underline" onClick={() => {
                                                    viewOrder(data._id)
                                                }}>
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                                {data.status.toLowerCase() === "placed" && (
                                                    <button className="text-black me-5 font-bold hover:underline" onClick={() => {
                                                        deleteOrder(data._id)
                                                    }}>
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6 text-red-500 font-bold">
                                            No Orders Found
                                        </td>
                                    </tr>
                                )}


                            </tbody>

                        </table>

                    </div>
                </div>

                {/* pagination */}
                {myOrderDatas.length > 0 && (
                    <div className="flex justify-between items-center border-t p-4 bg-white">

                        <div className="sm:flex justify-between items-center w-full">
                            <h2 className="flex items-center gap-1 whitespace-nowrap">
                                showing <b>{startValue}</b> - <b>{endValue}</b> of <b>{totalDataCount}</b>
                            </h2>
                            <div className="flex items-center gap-6">

                                <select className="border rounded px-2 py-1" onChange={(event) => {
                                    setDynamicPageNumber(event.target.value)
                                    setCurrentPage(1)
                                }} value={dynamicPageNumber}>
                                    <option>5</option>
                                    <option>10</option>
                                    <option>20</option>
                                </select>

                                <button className="border px-3 py-1 rounded" onClick={() => {
                                    previous()
                                }} disabled={currentPage === 1}>previous</button>

                                <h2 className="flex items-center gap-1 whitespace-nowrap">
                                    page <b>{currentPage}</b> of <b>{totalPages}</b>
                                </h2>

                                <button className="border px-3 py-1 rounded" onClick={() => {
                                    next()
                                }} disabled={currentPage === totalPages}>next</button>
                            </div>
                        </div>

                    </div>
                )}
                {/* view order modal */}
                {viewOrderModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                        <div className="bg-white w-[90%] md:w-[650px] p-6 rounded-lg relative">

                            <button
                                onClick={() => setViewOrderModal(false)}
                                className="absolute top-3 right-3 text-gray-500"
                            >
                                <i class="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                                <i class="fa-regular fa-folder-open"></i>
                                Order Details
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-bold text-lg text-gray-800">Customer name:</p>
                                    <p className="text-gray-700 text-sm">{getParticularOrder?.orderUser?.[0]?.firstName}.{getParticularOrder?.orderUser?.[0]?.lastName}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">Customer name:</p>
                                    <p className="text-gray-700 text-sm">{getParticularOrder?.status}</p>
                                </div>

                                <div>
                                    <p className="font-bold text-lg text-gray-800">Order Date:</p>
                                    <p className="text-gray-700 text-sm">{new Date(getParticularOrder.addedOn).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">Shipping Address:</p>
                                    <p className="text-gray-700 text-sm">{getParticularOrder.shippingAddress}</p>
                                </div>

                            </div>

                            <div className="mt-5 border-t pt-4">

                                <h3 className="font-bold mb-2 border-b-4 border-black text-lg text-gray-800">Ordered Products : </h3>

                                <div className="space-y-2">
                                    {getParticularOrder?.orderProduct?.map((productData, productIndex) => {
                                        var getQuantity = getParticularOrder?.orderHistory
                                        return (
                                            <div className="flex justify-between text-sm pb-2 ">
                                                <p className='text-lg text-gray-800'>{productData.name} <span className='text-black font-bold'>({productData.category})</span></p>
                                                <p className='text-gray-700 text-sm'><i class="fa-solid fa-dollar-sign"></i> {productData.price} x {getQuantity[productIndex].quantity}</p>
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>


                            <div className="mt-4 flex justify-between font-bold text-lg pt-3 border-t-4 border-black">
                                <p className="font-bold text-gray-800 text-lg">Total Price</p>
                                <p className="font-bold text-gray-700 text-sm"><i class="fa-solid fa-dollar-sign"></i> {getParticularOrder?.orderHistory?.reduce((acc, item) => acc + item.totalPrice, 0)}</p>
                            </div>

                        </div>
                    </div>
                )}

                {/* footer */}
                <Footer />

            </div>
        </div>
    )
}
