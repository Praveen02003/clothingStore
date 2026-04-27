import React, { useContext, useEffect, useState } from 'react'
// import { Navbar } from '../navbar/Navbar'
import '../products/AdminProducts.css'
import { Sidebar } from '../sidebar/Sidebar'
import { mainContext } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminFooter } from '../footer/Footer';
import { AdminNavbar } from '../navbar/AdminNavbar';
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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);


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
            const getData = await axios.get(`http://localhost:5000/getAllConsumers?page=${currentPage}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(getData.data.totalPage);
            var allData = getData.data.data
            var totalPages = getData.data.totalPage / 5
            setAllConsumers(allData)
            setTotalPages(totalPages)
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
                getAllConsumers();
            }
        }
        else {
            navigate('/login')
        }
    }


    // pagination functionality
    var totalPagesArrray = [];

    function pagination() {
        for (let index = 0; index < totalPages; index++) {
            totalPagesArrray.push(index)
        }
    }

    pagination()

    // next function
    function next() {
        setCurrentPage(currentPage + 1)
    }

    // previous function
    function previous() {
        setCurrentPage(currentPage - 1)
    }




    useEffect(() => {
        try {
            authUser()
        } catch (error) {
            console.log("error");
        }
    }, [currentPage])

    return (
        <div className="flex h-screen">

            {/* sidebar */}
            <Sidebar />

            <div className="flex flex-col flex-1">

                <AdminNavbar />
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-semibold"> <i className="fa-solid fa-users"></i> Consumers</h2>
                </div>

                {/* cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-user text-2xl"></i> Total Consumers Count</h2>
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

                <div className="flex items-center justify-between border-t bg-white px-4 py-3">

                    <div className="sm:flex sm:flex-1 sm:items-center sm:justify-end">

                        {/* pagination */}
                        {allConsumers.length > 0 && (
                            <div className="flex items-center gap-1 mt-4">

                                <button
                                    className={`px-2 py-1 border rounded ${currentPage === 1 ? "bg-gray-500" : "bg-white"}`}
                                    onClick={() => previous()}
                                    disabled={currentPage === 1}>
                                    Previous
                                </button>

                                {totalPagesArrray.map((data, index) => (
                                    <button
                                        key={index}
                                        onClick={() => { setCurrentPage(index + 1) }}
                                        className={`px-3 py-1 rounded ${currentPage === index + 1
                                            ? "bg-blue-600 text-white"
                                            : "border"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    className={`px-2 py-1 border rounded ${currentPage === totalPages ? "bg-gray-500" : "bg-white"}`}
                                    onClick={() => next()}
                                    disabled={currentPage === totalPages}>
                                    Next
                                </button>

                            </div>
                        )}

                    </div>

                </div>

                {/* view consumer modal */}
                {viewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[60%] p-6 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <button className="absolute top-4 right-4 justify-end text-black" onClick={() => {
                                    closeViewModal()
                                }}>
                                    <i className="fa-solid fa-circle-xmark"></i>
                                </button>
                                {getParticularConsumer.images ? (
                                    <img
                                        src={`http://localhost:5000/uploadingImages/${getParticularConsumer.images}`}
                                        alt="user"
                                        className="w-80 rounded-lg h-80"
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
                                </div>

                            </div>

                        </div>
                    </div>
                )}


                {/* footer section */}
                <AdminFooter />
            </div>
        </div>
    );
};

