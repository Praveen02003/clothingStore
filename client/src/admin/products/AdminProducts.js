import React, { useContext, useEffect } from 'react'
// import { Navbar } from '../navbar/Navbar'
import '../products/AdminProducts.css'
import { Sidebar } from '../sidebar/Sidebar'
import { mainContext } from '../../App';
import axios from 'axios';
export const AdminProducts = () => {

    const {
        open,
        setOpen,
        viewModal,
        setViewModal,
        editModal,
        setEditModal,
        deleteModal,
        setDeleteModal,
        addModal,
        setAddModal,
        allProducts,
        setAllProducts,
        getParticularProduct,
        setGetParticularProduct,
        particularProductId,
        setParticularProductId
    } = useContext(mainContext);

    async function particularProduct(id) {
        try {
            const getOneData = await axios.get(`http://localhost:5000/getOneProduct/${id}`)
            console.log(getOneData.data.data, "==>");
            setGetParticularProduct(getOneData.data.data)

        } catch (error) {
            console.log("error");

        }
    }

    async function deleteParticularProduct(id) {
        try {
            const deleteOneData = await axios.get(`http://localhost:5000/deleteParticularProduct/${id}`)
            console.log(deleteOneData.data.message, "==>");
            alert(deleteOneData.data.message)
            if (deleteOneData.data.message === "Data Deleted") {
                closeDeleteModal();
                getAllProducts();
            }

        } catch (error) {
            console.log("error");

        }
    }

    // view modal
    function openViewModal(id) {
        particularProduct(id)
        setViewModal(true)
    }
    function closeViewModal() {
        setViewModal(false)
        setGetParticularProduct({})
    }

    // delete modal
    function openDeleteModal(id) {
        setDeleteModal(true)
        setParticularProductId(id)
    }
    function closeDeleteModal() {
        setDeleteModal(false)
    }

    // edit modal
    function openEditModal(id) {
        particularProduct(id)
        setEditModal(true)
    }
    function closeEditModal() {
        setEditModal(false)
    }

    // add modal
    function openAddModal(id) {
        setAddModal(true)
    }
    function closeAddModal() {
        setAddModal(false)
    }

    async function getAllProducts() {
        try {
            const getData = await axios.get("http://localhost:5000/getAllProducts")
            console.log(getData.data.data);
            setAllProducts(getData.data.data)
        } catch (error) {
            console.log("error");

        }
    }

    useEffect(() => {
        try {
            getAllProducts();
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

                        <h2 className="font-semibold">Our Products</h2>

                    </div>
                    <div className="flex items-center gap-4">
                        <button className='bg-blue-500 px-4 py-3 rounded text-white font-bold' onClick={() => openAddModal()}>Add Product</button>
                    </div>
                </div>

                {/* all cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold">Total Products Count</h2>
                        <p className="text-xl sm:text-2xl font-bold mt-2 text-black">{allProducts.length}</p>
                    </div>
                </div>

                {/* products table */}
                <div className="flex items-center h-16 bg-white border-b px-4">
                    <h2 className="font-semibold">Products Table</h2>
                </div>

                <div className="p-4">
                    <div className="max-h-96 overflow-y-auto overflow-x-auto shadow-md rounded-lg">

                        <table className="w-full text-sm text-left text-gray-500">

                            <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                                <tr>
                                    <th className="px-6 py-3">S.no</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">price</th>
                                    <th className="px-6 py-3">stock</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allProducts.map((data, index) => {
                                    return (
                                        <tr className="bg-white border-b hover:bg-gray-50" key={index}>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.name}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                <i className="fa-solid fa-indian-rupee-sign"></i> {data.price}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.stock}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button className="text-green-900 me-5 font-bold hover:underline" onClick={() => openViewModal(data._id)}>
                                                    View
                                                </button>
                                                <button className="text-blue-600 me-5 font-bold hover:underline" onClick={() => openEditModal(data._id)}>
                                                    Edit
                                                </button>
                                                <button className="text-red-600 me-5 font-bold hover:underline" onClick={() => openDeleteModal(data._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>

                        </table>

                    </div>
                </div>

                {/* delete confirmation modal */}
                {deleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300">

                        <div className="bg-white rounded-lg shadow-xl p-6">

                            <div className="flex items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-red-600">
                                        Delete Confirmation
                                    </h3>

                                    <p className="mt-2 text-black text-lg font-bold">
                                        Are you sure you want to delete the product ?
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2">

                                <button onClick={() => { deleteParticularProduct(particularProductId) }} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">
                                    Delete
                                </button>

                                <button onClick={() => closeDeleteModal()} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {/* view product modal */}
                {viewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[60%] p-6 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <img
                                    src=""
                                    alt="product"
                                    className="w-full rounded-lg"
                                />

                                <div>
                                    <h2 className="text-2xl text-gray-900">
                                        <span className='font-bold'>Name : </span>
                                        {getParticularProduct.name}
                                    </h2>

                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Offer : </span>
                                        {getParticularProduct.offer} <i class="fa-solid fa-percent"></i> off
                                    </p>
                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Sale Price : </span>
                                        <i class="fa-solid fa-indian-rupee-sign"></i> {getParticularProduct.price}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Original Price : </span>
                                        <i class="fa-solid fa-indian-rupee-sign"></i> {getParticularProduct.defaultPrice}
                                    </p>

                                    <p className="mt-4 text-black text-lg">
                                        <ul>
                                            <span className='font-bold'>colors:</span>
                                            {getParticularProduct.colors?.map((oneData, oneIndex) => {
                                                return (
                                                    <li key={oneIndex}>{oneIndex + 1} . {oneData}</li>
                                                )
                                            })}
                                        </ul>
                                    </p>

                                    <p className="mt-4 text-black text-lg">
                                        <ul>
                                            <span className='font-bold'>sizes:</span>
                                            {getParticularProduct.sizes?.map((oneData, oneIndex) => {
                                                return (
                                                    <li key={oneIndex}>{oneIndex + 1} . {oneData}</li>
                                                )
                                            })}
                                        </ul>
                                    </p>
                                    <p className="mt-4 text-black text-lg">
                                        <span className='font-bold'>Description: </span>
                                        {getParticularProduct.description}
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

                {/* edit product modal */}
                {editModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

                            <button
                                onClick={() => closeEditModal()}
                                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            >
                                <i class="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

                            <form className="space-y-4">

                                <div>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter name"
                                        value={getParticularProduct.name}
                                    />
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter price"
                                        value={getParticularProduct.price}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter default price"
                                        value={getParticularProduct.defaultPrice}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter offer"
                                        value={getParticularProduct.offer}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter stock"
                                        value={getParticularProduct.stock}
                                    />
                                </div>
                                <div class="sm:w-100">
                                    <select class="w-full border rounded px-3 py-2">
                                        <option>Select Color</option>
                                        <option value="blue">blue</option>
                                        <option value="red">red</option>
                                        <option value="green">green</option>
                                    </select>
                                </div>
                                <div class="sm:w-100">
                                    <select class="w-full border rounded px-3 py-2">
                                        <option>Select Size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter category"
                                        value={getParticularProduct.category}
                                    />
                                </div>
                                <div>
                                    <textarea className="w-full border rounded px-3 py-2" placeholder='Enter description' value={getParticularProduct.description}></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                                >
                                    Update
                                </button>

                            </form>

                        </div>
                    </div>
                )}


                {/* add product modal */}
                {addModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

                            <button
                                onClick={() => closeAddModal()}
                                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            >
                                <i class="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Add Product</h2>

                            <form className="space-y-4">

                                <div>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter name"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter price"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter default price"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter offer"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter stock"
                                    />
                                </div>
                                <div class="sm:w-100">
                                    <select class="w-full border rounded px-3 py-2">
                                        <option>Select Color</option>
                                        <option value="blue">blue</option>
                                        <option value="red">red</option>
                                        <option value="green">green</option>
                                    </select>
                                </div>
                                <div class="sm:w-100">
                                    <select class="w-full border rounded px-3 py-2">
                                        <option>Select Size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter category"
                                    />
                                </div>
                                <div>
                                    <textarea className="w-full border rounded px-3 py-2" placeholder='Enter description'></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                                >
                                    Add
                                </button>

                            </form>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

