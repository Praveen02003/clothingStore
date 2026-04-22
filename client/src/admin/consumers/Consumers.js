import React, { useContext, useEffect } from 'react'
// import { Navbar } from '../navbar/Navbar'
import '../products/AdminProducts.css'
import { Sidebar } from '../sidebar/Sidebar'
import { mainContext } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

    async function particularConsumer(id) {
        try {
            const token = localStorage.getItem('loginToken');
            const getOneData = await axios.get(`http://localhost:5000/getOneConsumer/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(getOneData.data.data, "==>");
            setGetParticularConsumer(getOneData.data.data)

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


    // view modal
    function openViewModal(id) {
        particularConsumer(id)
        setViewModal(true)
    }
    function closeViewModal() {
        setViewModal(false)
        setParticularConsumerId({})
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        navigate('/login')
    }

    async function getAllConsumers() {
        try {
            const token = localStorage.getItem('loginToken');
            const getData = await axios.get("http://localhost:5000/getAllConsumers", {
                headers: {
                    Authorization: token
                }
            })
            console.log(getData.data.data);
            setAllConsumers(getData.data.data)
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
                        <button className="md:hidden text-xl" onClick={() => setOpen(true)}>
                            <i className="fa-solid fa-bars"></i>
                        </button>

                        <h2 className="font-semibold text-sm md:text-base">
                            Our Consumers
                        </h2>
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
                        <h2 className="text-base sm:text-lg font-semibold"> <i class="fa-solid fa-user text-2xl"></i> Total Consumers Count</h2>
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
                                    <th className="px-6 py-3">First Name</th>
                                    <th className="px-6 py-3">Last Name</th>
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
                                                {data.firstName}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.lastName}
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[60%] p-6 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {getParticularConsumer.images ? (
                                    <img
                                        src={`http://localhost:5000/uploadingImages/${getParticularConsumer.images}`}
                                        alt="user"
                                        className="w-full rounded-lg"
                                    />
                                ) : (<p className='text-red-600 font-bold'>No Image</p>)}

                                <div>
                                    <p className="text-xl mt-2 text-gray-700">
                                        <span className='font-bold'>First Name :</span> {getParticularConsumer.firstName}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        <span className='font-bold'>Last Name :</span> {getParticularConsumer.lastName}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        <span className='font-bold'>Email :</span> {getParticularConsumer.email}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        <span className='font-bold'>Mobile Number :</span> {getParticularConsumer.mobile}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        <span className='font-bold'>Gender :</span> {getParticularConsumer.gender}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        <span className='font-bold'>Status :</span> {getParticularConsumer.status}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-700">
                                        <span className='font-bold'>Address :</span> {getParticularConsumer.address}
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

