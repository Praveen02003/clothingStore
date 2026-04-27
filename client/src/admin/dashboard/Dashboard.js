import React, { use, useContext, useEffect, useState } from "react";
import "../dashboard/Dashboard.css";
import { mainContext } from "../../App";
import { Sidebar } from "../sidebar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminFooter } from "../footer/Footer";
import { AdminNavbar } from "../navbar/AdminNavbar";

export const Dashboard = () => {

    const {
        open,
        setOpen,
        getAllAdminDashBoardData,
        setGetAllAdminDashBoardData
    } = useContext(mainContext);

    const navigate = useNavigate();

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        navigate('/login')
    }

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

                <AdminNavbar />

                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-semibold"> <i className="fa-solid fa-gauge-high"></i> Dashboard Analytics</h2>

                    <select className="w-60 border border-black rounded-md px-3 py-2 text-sm" onChange={(event) => { getAdminDashBoardData(event.target.value) }}>
                        <option value="this">This Month</option>
                        <option value="last">Last Month</option>
                    </select>
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