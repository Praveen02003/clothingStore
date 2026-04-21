import React, { useContext, useEffect } from "react";
import "../dashboard/Dashboard.css";
import { mainContext } from "../../App";
import { Sidebar } from "../sidebar/Sidebar";
import axios from "axios";

export const Dashboard = () => {

    const {
        open,
        setOpen,
        getAllAdminDashBoardData,
        setGetAllAdminDashBoardData
    } = useContext(mainContext);

    async function getAdminDashBoardData() {
        try {
            var getData = await axios.get("http://localhost:5000/getAdminDashBoardDatas")
            console.log(getData.data.data);
            setGetAllAdminDashBoardData(getData.data.data);

        } catch (error) {
            console.log("error");

        }
    }

    useEffect(() => {
        try {
            getAdminDashBoardData();
        } catch (error) {

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

                        <h2 className="font-semibold">Dashboard Analytics</h2>
                    </div>
                </div>

                {/* all cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold">Consumers Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.consumerCount}</p>
                        <a className="mt-3 text-blue-600 hover:underline font-bold" href="/admin/consumers">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold">Products Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{getAllAdminDashBoardData.productCount}</p>
                        <a className="mt-30 text-blue-600 hover:underline font-bold" href="/admin/adminProducts">
                            View
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold">Orders Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">5</p>
                        <button className="mt-3 text-blue-600 hover:underline font-bold">
                            View
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold">Total Purchase</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">5</p>
                        <button className="mt-3 text-blue-600 hover:underline font-bold">
                            View
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold">Categories Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">5</p>
                        <button className="mt-3 text-blue-600 hover:underline font-bold">
                            View
                        </button>
                    </div>

                </div>

                {/* orders table */}
                <div className="flex items-center h-16 bg-white border-b px-4">
                    <h2 className="font-semibold">Orders Table</h2>
                </div>

                <div className="p-4">
                    <div className="max-h-96 overflow-y-auto overflow-x-auto shadow-md rounded-lg">

                        <table className="w-full text-sm text-left text-gray-500">

                            <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                                <tr>
                                    <th className="px-6 py-3">S.no</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">TotalPaid</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50">

                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        1.
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        Praveen
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        praveen@gmail.com
                                    </td>


                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        <i class="fa-solid fa-indian-rupee-sign"></i> 5000
                                    </td>

                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:underline font-bold">
                                            View Order
                                        </button>
                                    </td>

                                </tr>
                            </tbody>

                        </table>

                    </div>
                </div>

            </div>
        </div>
    );
};