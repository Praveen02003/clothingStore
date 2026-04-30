import React, { use, useContext, useEffect, useState } from "react";
import "../dashboard/Dashboard.css";
import { mainContext } from "../../App";
import { Sidebar } from "../sidebar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminFooter } from "../footer/Footer";
import { AdminNavbar } from "../navbar/AdminNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

    async function getAdminDashBoardData(startDate = "", endDate = "") {
        setSpinnerLoader(true)
        // console.log(sort);

        try {
            const token = localStorage.getItem('loginToken');
            var getData = await axios.get(`http://localhost:5000/getAdminDashBoardDatas?startDates=${startDate}&endDates=${endDate}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(getData.data.data);
            setGetAllAdminDashBoardData(getData.data.data);
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
            if (user.role.toLowerCase() !== "admin") {
                navigate("/");
            }
            else if (user.role.toLowerCase() === "admin") {
                var date = new Date();
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

                <div className="flex justify-between items-center p-6">
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

                    {/* <input type="date" className="w-60 border border-black rounded-md px-3 py-2 text-sm" onChange={(event) => { getAdminDashBoardData(event.target.value) }} /> */}
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
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black"><i class="fa-solid fa-dollar-sign"></i> {getAllAdminDashBoardData.totalPurchase || 0}</p>
                    </div>
                </div>

                {/* footer section */}
                <AdminFooter />
            </div>
        </div>
    );
};