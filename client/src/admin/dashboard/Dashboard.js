import React, { use, useContext, useEffect, useState } from "react";
import "../dashboard/Dashboard.css";
import { mainContext } from "../../App";
import { Sidebar } from "../sidebar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminFooter } from "../footer/Footer";

export const Dashboard = () => {

    const {
        open,
        setOpen,
        getAllAdminDashBoardData,
        setGetAllAdminDashBoardData
    } = useContext(mainContext);

    const navigate = useNavigate();

    const [dropDownOpen, setDropDownOpen] = useState(false)

    async function getAdminDashBoardData(sort = "") {
        try {
            const token = localStorage.getItem('loginToken');
            var getData = await axios.get(`http://localhost:5000/getAdminDashBoardDatas/${sort}`, {
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

    // openDropdown function
    function openDropdown() {
        setDropDownOpen(!dropDownOpen)
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
                getAdminDashBoardData("this");
            }
        }
        else {
            navigate('/login')
        }
    }


    useEffect(() => {
        try {
            authUser()
        } catch (error) {
            console.log("error");

        }
    }, [])

    return (
        <div className="flex h-screen">

            {/* sidebar */}
            <Sidebar />

            <div className="flex flex-col flex-1">

                <div className="flex items-center justify-between h-16 bg-gray-700 border-b px-4">

                    <div className="flex items-center gap-4 p-5">

                        {/* hamburger button */}
                        <button
                            onClick={() => setOpen(true)}
                            className="text-xl text-white"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>

                        <h2 className="font-semibold text-white"> <i className="fa-solid fa-gauge-high text-2xl"></i> Dashboard Analytics</h2>
                    </div>
                    {/* logout button */}
                    <div className="flex items-center gap-2">
                        <button className="bg-red-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                            logOut()
                        }}>
                            <i className="fa-solid fa-right-from-bracket"></i> Log Out
                        </button>
                    </div>
                </div>

                <div className="relative inline-block">

                    {/* Button */}
                    <button className="bg-gray-600 text-white absolute right-0 mt-2 me-10 flex items-center gap-2 px-3 py-2 border rounded-md" onClick={() => { openDropdown() }}>
                        Sort by month
                    </button>


                    {dropDownOpen && (
                        <div className="absolute right-0 top-12 mt-2 me-5 w-40 border rounded shadow">

                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => {
                                getAdminDashBoardData("this")
                            }}>
                                This month
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => {
                                getAdminDashBoardData("previous")
                            }}>
                                Previous month
                            </button>
                        </div>
                    )}

                </div>


                {/* cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-user-tie"></i> Consumers Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.consumerCount}</p>
                        <a className="mt-3 text-blue-600 hover:underline font-bold" href="/admin/consumers">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-shirt"></i> Products Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.productCount}</p>
                        <a className="mt-30 text-blue-600 hover:underline font-bold" href="/admin/adminProducts">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-ranking-star text-2xl"></i> Orders Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">5</p>
                        <button className="mt-3 text-blue-600 hover:underline font-bold">
                            View
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-calculator"></i> Total Purchase</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">5</p>
                    </div>
                </div>
                
                {/* footer section */}
                <AdminFooter />
            </div>
        </div>
    );
};