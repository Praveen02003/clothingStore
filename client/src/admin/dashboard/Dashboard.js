import React, { useContext, useEffect } from "react";
import "../dashboard/Dashboard.css";
import { mainContext } from "../../App";
import { Sidebar } from "../sidebar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {

    const {
        open,
        setOpen,
        getAllAdminDashBoardData,
        setGetAllAdminDashBoardData
    } = useContext(mainContext);

    const navigate = useNavigate();

    async function getAdminDashBoardData() {
        try {
            const token = localStorage.getItem('loginToken');
            var getData = await axios.get("http://localhost:5000/getAdminDashBoardDatas", {
                headers: {
                    Authorization: token
                }
            })
            console.log(getData.data.data);
            setGetAllAdminDashBoardData(getData.data.data);

        } catch (error) {
            console.log(error.response.data.message);
            alert(error.response.data.message)
            if (error.response.data.message === "Access denied") {
                logOut()
            }
            else if (error.response.data.message === "Invalid token") {
                logOut()
            }
        }
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        navigate('/login')
    }

    useEffect(() => {
        try {
            getAdminDashBoardData();
        } catch (error) {
            console.log("error");

        }
    }, [])

    return (
        <div className="flex h-screen">

            {/* sidebar */}
            <Sidebar />

            <div className="flex flex-col flex-1">

                <div className="flex items-center justify-between h-16 bg-white border-b px-4">

                    <div className="flex items-center gap-4">

                        {/* hamburger button */}
                        <button
                            onClick={() => setOpen(true)}
                            className="md:hidden text-xl"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>

                        <h2 className="font-semibold"> <i class="fa-solid fa-gauge-high text-2xl"></i> Dashboard Analytics</h2>
                    </div>
                    {/* logout button */}
                    <div className="flex items-center gap-2">
                        <button className="bg-red-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                            logOut()
                        }}>
                            <i class="fa-solid fa-right-from-bracket"></i> Log Out
                        </button>
                    </div>
                </div>

                {/* cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i class="fa-solid fa-user-tie"></i> Consumers Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.consumerCount}</p>
                        <a className="mt-3 text-blue-600 hover:underline font-bold" href="/admin/consumers">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i class="fa-solid fa-shirt"></i> Products Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.productCount}</p>
                        <a className="mt-30 text-blue-600 hover:underline font-bold" href="/admin/adminProducts">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i class="fa-solid fa-ranking-star text-2xl"></i> Orders Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">5</p>
                        <button className="mt-3 text-blue-600 hover:underline font-bold">
                            View
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i class="fa-solid fa-calculator"></i> Total Purchase</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">5</p>
                    </div>
                </div>
            </div>
        </div>
    );
};