import React, { useContext, useEffect } from 'react'
// import { Navbar } from '../navbar/Navbar'
import '../products/AdminProducts.css'
import { Sidebar } from '../sidebar/Sidebar'
import { mainContext } from '../../App';
import axios from 'axios';
export const Consumers = () => {

    const {
        open,
        setOpen,
        viewModal,
        setViewModal,
        allConsumers,
        setAllConsumers,
        getParticularConsumer,
        setGetParticularConsumer,
        particularConsumerId,
        setParticularConsumerId,
    } = useContext(mainContext);

    async function particularConsumer(id) {
        try {
            const getOneData = await axios.get(`http://localhost:5000/getOneConsumer/${id}`)
            console.log(getOneData.data.data, "==>");
            setGetParticularConsumer(getOneData.data.data)

        } catch (error) {
            console.log("error");

        }
    }


    // view modal
    function openViewModal(id) {
        particularConsumer(id)
        setViewModal(true)
    }
    function closeViewModal() {
        setViewModal(false)
        setParticularConsumerId({})
    }

    async function getAllConsumers() {
        try {
            const getData = await axios.get("http://localhost:5000/getAllConsumers")
            console.log(getData.data.data);
            setAllConsumers(getData.data.data)
        } catch (error) {
            console.log("error");

        }
    }

    useEffect(() => {
        try {
            getAllConsumers();
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

                        <h2 className="font-semibold">Our Consumers</h2>
                    </div>
                </div>

                {/* all cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold">Total Consumers Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{allConsumers.length}</p>
                    </div>
                </div>

                {/* products table */}
                <div className="flex items-center h-16 bg-white border-b px-4">
                    <h2 className="font-semibold">Consumers Table</h2>
                </div>

                <div className="p-4">
                    <div className="max-h-96 overflow-y-auto overflow-x-auto shadow-md rounded-lg">

                        <table className="w-full text-sm text-left text-gray-500">

                            <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                                <tr>
                                    <th className="px-6 py-3">S.no</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allConsumers.map((data, index) => {
                                    return (
                                        <tr className="bg-white border-b hover:bg-gray-50" key={index}>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.firstName} {data.lastName}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.email}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.status}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button className="text-blue-500 me-5 font-bold hover:underline" onClick={() => openViewModal(data._id)}>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>

                        </table>

                    </div>
                </div>

                {/* view product modal */}
                {viewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[60%] p-6 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <img
                                    src=""
                                    alt="user"
                                    className="w-full rounded-lg"
                                />

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Name : {getParticularConsumer.firstName} {getParticularConsumer.lastName}
                                    </h2>

                                    <p className="text-xl mt-2 text-gray-700">
                                        Email : {getParticularConsumer.email}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        MobileNumber : {getParticularConsumer.mobile}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        Gender : {getParticularConsumer.gender}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        Status : {getParticularConsumer.status}
                                    </p>
                            
                                    <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-indigo-700" onClick={() => {
                                        closeViewModal()
                                    }}>
                                        Close
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

