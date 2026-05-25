import React, { use, useContext, useEffect, useState } from "react";
import "../dashboard/Dashboard.css";
import { mainContext } from "../../App";
import { Sidebar } from "../sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { AdminFooter } from "../footer/Footer";
import { AdminNavbar } from "../navbar/AdminNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../axios/AxiosFile";

import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";


const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "right",
            labels: {
                boxWidth: 40,
                padding: 15
            }
        }
    }
};

function RevenueChart({ getAllAdminDashBoardData }) {
    const data = {
        labels: ["Revenue"],
        datasets: [
            {
                label: "Total Purchase",
                data: [getAllAdminDashBoardData?.totalPurchase || 0]
            }
        ]
    };

    return <Bar data={data} options={options} />;
}

function CountChart({ getAllAdminDashBoardData }) {
    const data = {
        labels: ["Consumers Counts", "Products Counts", "Orders Counts"],
        datasets: [
            {
                label: "Counts",
                data: [
                    getAllAdminDashBoardData?.consumerCount || 0,
                    getAllAdminDashBoardData?.productCount || 0,
                    getAllAdminDashBoardData?.ordersCount || 0,
                ]
            }
        ]
    };

    return (
        <Pie data={data} options={options} />
    );
}

function OrderStatusCountChart({ getAllAdminDashBoardData }) {
    const data = {
        labels: ["Payment Success", "Payment Failed"],
        datasets: [
            {
                label: "Counts",
                data: [
                    getAllAdminDashBoardData?.orderSuccessCount || 0,
                    getAllAdminDashBoardData?.orderFailedCount || 0
                ]
            }
        ]
    };

    return (
        <Pie data={data} options={options} />
    );
}

export const Dashboard = () => {

    const [startDates, setStartDates] = useState();
    const [endDates, setEndDates] = useState();

    const {
        open,
        setOpen,
        getAllAdminDashBoardData,
        setGetAllAdminDashBoardData
    } = useContext(mainContext);

    const navigate = useNavigate();

    const [spinnerLoader, setSpinnerLoader] = useState(false);

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('sidebarOpen')
        navigate('/login')
    }

    // getAdminDashBoardData function
    async function getAdminDashBoardData(startDate = "", endDate = "") {
        setSpinnerLoader(true)
        // console.log(sort);

        try {
            // const token = localStorage.getItem('loginToken');
            var getData = await api.get(`/api/products/getAdminDashBoardDatas?startDates=${startDate}&endDates=${endDate}`)
            console.log(getData.data.data);
            setGetAllAdminDashBoardData(getData.data.data);
            setSpinnerLoader(false)

        } catch (error) {
            setSpinnerLoader(false)
            console.log(error?.response?.data?.message);
            // alert(error.response.data.message)
            var message = error?.response?.data?.message
            if (message === "Access denied") {
                logOut()
            }
            else if (message === "Invalid token") {
                logOut()
            }
        }
    }



    // authUser function
    function authUser() {
        var user = JSON.parse(localStorage.getItem('loginUser'))
        var token = localStorage.getItem('loginToken')
        console.log(user, "===>");

        if (user && token) {
            if (user.role.toLowerCase() !== "admin") {
                navigate("/");
            }
            else if (user.role.toLowerCase() === "admin") {
                var date = new Date().toLocaleDateString();
                console.log(date);
                getAdminDashBoardData(date, date);
            }
        }
        else {
            navigate('/login')
        }
    }

    const updateDate = (dates) => {
        const [start, end] = dates;
        console.log(start);
        console.log(end);

        setStartDates(start);
        setEndDates(end);
        if (start && end) {
            getAdminDashBoardData(start, end);
        }
    };


    useEffect(() => {
        try {
            authUser()
        } catch (error) {
            console.log("error");

        }
    }, [])

    return (
        <div className={`flex-1 transition-all duration-300 
            ${open ? "ml-64" : "ml-16"}`}>

            {/* sidebar */}
            <Sidebar />

            {spinnerLoader && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                </div>
            )}

            <div className="flex flex-col flex-1">

                <AdminNavbar />

                <div className="flex justify-between items-center p-8">
                    <h2 className="text-lg font-semibold"> <i className="fa-solid fa-gauge-high"></i> Dashboard Analytics</h2>
                    <div className="flex justify-center">
                        <DatePicker
                            selectsRange
                            startDate={startDates}
                            endDate={endDates}
                            onChange={(dates) => {
                                updateDate(dates)
                            }}
                            isClearable
                            placeholderText="Select date range"
                            maxDate={new Date()}
                        />

                    </div>
                </div>


                {/* cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-user-tie"></i> Consumers Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.consumerCount || 0}</p>
                        <a className="mt-3 text-blue-600 hover:underline font-bold" href="/admin/consumers">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-shirt"></i> Products Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.productCount || 0}</p>
                        <a className="mt-30 text-blue-600 hover:underline font-bold" href="/admin/adminProducts">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-ranking-star text-2xl"></i> Orders Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.ordersCount || 0}</p>
                        <a className="mt-30 text-blue-600 hover:underline font-bold" href="/admin/orders">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-calculator"></i> Total Purchase</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black"><i className="fa-solid fa-dollar-sign"></i> {getAllAdminDashBoardData.totalPurchase || 0}</p>
                    </div>
                </div>

                {/* chart section */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-5">
                    <h1 className="font-bold text-2xl">Consumers,Products & Orders Counts</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-96 w-full flex items-center justify-center bg-white rounded">
                        <CountChart getAllAdminDashBoardData={getAllAdminDashBoardData} />
                    </div>

                    <div className="overflow-x-auto px-4 md:px-20 mt-6">
                        <table className="w-80 max-w-7xl mx-auto">
                            <thead className="text-slate-900 text-left text-sm font-semibold border-b border-slate-300 whitespace-nowrap">
                                <tr>
                                    <th className="pl-0 px-3 py-4">Name</th>
                                    <th className="px-3 py-4">Counts</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y">
                                <tr>
                                    <td className="pl-0 px-3 py-4 font-medium text-black whitespace-nowrap">
                                        Consumers
                                    </td>
                                    <td className="px-3 py-4 text-black font-bold">
                                        {getAllAdminDashBoardData.consumerCount || 0}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pl-0 px-3 py-4 font-medium text-black whitespace-nowrap">
                                        Products
                                    </td>
                                    <td className="px-3 py-4 text-black font-bold">
                                        {getAllAdminDashBoardData.productCount || 0}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pl-0 px-3 py-4 font-medium text-black whitespace-nowrap">
                                        Orders
                                    </td>
                                    <td className="px-3 py-4 text-black font-bold">
                                        {getAllAdminDashBoardData.ordersCount || 0}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-5">
                    <h1 className="font-bold text-2xl">Total Revenue</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-96 w-full flex items-center justify-center bg-white rounded p-10">
                        <RevenueChart getAllAdminDashBoardData={getAllAdminDashBoardData} />
                    </div>

                    <div className="overflow-x-auto px-4 md:px-20 mt-6">
                        <table className="w-80 max-w-7xl mx-auto">
                            <thead
                                className="text-slate-900 text-left text-sm font-semibold border-b border-slate-300 whitespace-nowrap">
                                <tr>
                                    <th className="pl-0 px-3 py-4">Name</th>
                                    <th className="px-3 py-4">Revenue Amount</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y">
                                <tr>
                                    <td className="pl-0 px-3 py-4 font-medium text-black whitespace-nowrap">
                                        Total Purchase
                                    </td>
                                    <td className="px-3 py-4 text-black font-bold">
                                        <i class="fa-solid fa-dollar-sign"></i> {getAllAdminDashBoardData.totalPurchase || 0}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-5">
                    <h1 className="font-bold text-2xl">Payment Success & Failed Counts</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-96 w-full flex items-center justify-center bg-white rounded">
                        <OrderStatusCountChart getAllAdminDashBoardData={getAllAdminDashBoardData} />
                    </div>

                    <div className="overflow-x-auto px-4 md:px-20 mt-6">
                        <table className="w-80 max-w-7xl mx-auto">
                            <thead className="text-slate-900 text-left text-sm font-semibold border-b border-slate-300 whitespace-nowrap">
                                <tr>
                                    <th className="pl-0 px-3 py-4">Name</th>
                                    <th className="px-3 py-4">Counts</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y">
                                <tr>
                                    <td className="pl-0 px-3 py-4 font-medium text-black whitespace-nowrap">
                                        Payment Success
                                    </td>
                                    <td className="px-3 py-4 text-black font-bold">
                                        {getAllAdminDashBoardData.orderSuccessCount || 0}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pl-0 px-3 py-4 font-medium text-black whitespace-nowrap">
                                        Payment Failed
                                    </td>
                                    <td className="px-3 py-4 text-black font-bold">
                                        {getAllAdminDashBoardData.orderFailedCount || 0}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* footer section */}
                <AdminFooter />
            </div>
        </div>
    );
};