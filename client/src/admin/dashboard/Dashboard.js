import React from "react";
import { Navbar } from "../navbar/Navbar";
import { Link } from "react-router-dom";

export const Dashboard = () => {
    return (
        <div>
            {/* navbar */}
            <Navbar />

            {/* cards */}
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <Link className="bg-white border rounded-lg shadow cursor-pointer" to={'/admin/consumers'}>
                        <div className="p-6 text-center">
                            <h5 className="mt-3 mb-4 text-lg font-semibold">
                                Total consumers
                            </h5>
                            <h3 className="text-lg font-bold">100</h3>
                        </div>
                    </Link>

                    <div className="bg-white border rounded-lg shadow cursor-pointer">
                        <div className="p-6 text-center">
                            <h5 className="mt-3 mb-4 text-lg font-semibold">
                                Total orders
                            </h5>
                            <h3 className="text-lg font-bold">50</h3>
                        </div>
                    </div>

                    <Link className="bg-white border rounded-lg shadow cursor-pointer" to={"/admin/adminProducts"}>
                        <div className="p-6 text-center">
                            <h5 className="mt-3 mb-4 text-lg font-semibold">
                                Total products
                            </h5>
                            <h3 className="text-lg font-bold">25</h3>
                        </div>
                    </Link>

                    <div className="bg-white border rounded-lg shadow cursor-pointer">
                        <div className="p-6 text-center">
                            <h5 className="mt-3 mb-4 text-lg font-semibold">
                                Total purchase count
                            </h5>
                            <h3 className="text-lg font-bold">
                                <i className="fa-solid fa-indian-rupee-sign"></i> 5000
                            </h3>
                        </div>
                    </div>

                </div>

                <h1 className="font-bold text-black text-center p-5 text-3xl">
                    Our Products
                </h1>

                <div className="relative overflow-x-auto bg-white shadow rounded border">
                    <table className="w-full text-sm text-left">
                        <thead className="text-sm bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium">Product name</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Stock</th>
                                <th className="px-6 py-3 font-medium">Price</th>
                                <th className="px-6 py-3 font-medium">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="bg-white border-b hover:bg-gray-100">
                                <th className="px-6 py-4 font-medium whitespace-nowrap">
                                    Apple Watch
                                </th>
                                <td className="px-6 py-4">Watches</td>
                                <td className="px-6 py-4">No</td>
                                <td className="px-6 py-4">$199</td>
                                <td className="flex items-center px-6 py-4">
                                    <a href="#" className="text-blue-600 hover:underline">Edit</a>
                                    <a href="#" className="text-red-500 hover:underline ms-3">View</a>
                                    <a href="#" className="text-red-500 hover:underline ms-3">Remove</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};