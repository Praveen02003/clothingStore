import React, { useContext, useEffect, useState } from 'react'
// import { Navbar } from '../navbar/Navbar'
import '../products/AdminProducts.css'
import { Sidebar } from '../sidebar/Sidebar'
import { mainContext } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminFooter } from '../footer/Footer';
import { AdminNavbar } from '../navbar/AdminNavbar';
export const AdminProducts = () => {

    var [editErrors, setEditErrors] = useState({
        nameError: "",
        defaultPriceError: "",
        offerError: "",
        descriptionError: "",
        stockError: "",
        colorError: "",
        sizeError: "",
        imageError: "",
        categoryError: ""
    })
    var [addErrors, setAddErrors] = useState({
        nameError: "",
        defaultPriceError: "",
        offerError: "",
        descriptionError: "",
        stockError: "",
        colorError: "",
        sizeError: "",
        imageError: "",
        categoryError: ""
    })

    const [addData, setAddData] = useState({
        name: "",
        price: 0,
        defaultPrice: 0,
        offer: "",
        description: "",
        stock: "",
        color: "",
        size: "",
        image: "",
        category: ""
    });

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

    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);

    async function particularProduct(id) {
        try {
            const token = localStorage.getItem('loginToken');
            const getOneData = await axios.get(`http://localhost:5000/getOneProduct/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(getOneData.data.data, "==>");
            setGetParticularProduct(getOneData.data.data)

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

    async function deleteParticularProduct(id) {
        try {
            const token = localStorage.getItem('loginToken');
            const deleteOneData = await axios.get(`http://localhost:5000/deleteParticularProduct/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(deleteOneData.data.message, "==>");
            alert(deleteOneData.data.message)
            if (deleteOneData.data.message === "Product Deleted Successfully") {
                closeDeleteModal();
                getAllProducts();
            }

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
    function openAddModal() {
        setAddModal(true)
    }
    function closeAddModal() {
        setAddModal(false)
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        navigate('/login')
    }


    // add product validation functions

    // validateName function
    function validateName(inputValue) {
        if (!inputValue) {
            setAddErrors({ ...addErrors, nameError: "Enter Product Name" })
        }
        else {
            setAddErrors({ ...addErrors, nameError: "" })
        }
        setAddData({ ...addData, name: inputValue })
    }
    // validatePrice function
    function validateDefaultPrice(inputValue) {

        if (!inputValue) {
            setAddErrors({ ...addErrors, defaultPriceError: "Enter Product Original Price" })
        }
        if (inputValue <= 0) {
            setAddErrors({ ...addErrors, defaultPriceError: "Enter Product Original Price > 0" })
        }
        else {
            setAddErrors({ ...addErrors, defaultPriceError: "" })
        }
        setAddData({ ...addData, defaultPrice: parseInt(inputValue), price: inputValue })
    }
    // validateOffer function
    function validateOffer(inputValue) {
        let offerPrice = 0;
        let originalPrice = addData.defaultPrice;

        if (inputValue === "" || inputValue === null) {
            setAddErrors({ ...addErrors, offerError: "Enter Offer if no offer type 0" });
        }

        else if (inputValue < 0 || inputValue > 100) {
            setAddErrors({ ...addErrors, offerError: "Enter Offer between 0 and 100" });
        }

        else {
            offerPrice = Math.floor(originalPrice - (originalPrice * inputValue) / 100);
            setAddErrors({ ...addErrors, offerError: "" });
        }

        setAddData({ ...addData, offer: inputValue, price: offerPrice });
    }
    // validateStock function
    function validateStock(inputValue) {
        if (!inputValue) {
            setAddErrors({ ...addErrors, stockError: "Enter Stock" })
        }
        else if (inputValue <= 0) {
            setAddErrors({ ...addErrors, stockError: "Enter Stock > 0" })
        }
        else {
            setAddErrors({ ...addErrors, stockError: "" })
        }
        setAddData({ ...addData, stock: inputValue })
    }

    // validateColor function
    function validateColor(inputValue) {
        if (!inputValue) {
            setAddErrors({ ...addErrors, colorError: "Select Color" })
        }
        else {
            setAddErrors({ ...addErrors, colorError: "" })
        }
        setAddData({ ...addData, color: inputValue })
    }

    // validateSize function
    function validateSize(inputValue) {
        if (!inputValue) {
            setAddErrors({ ...addErrors, sizeError: "Select Size" })
        }
        else {
            setAddErrors({ ...addErrors, sizeError: "" })
        }
        setAddData({ ...addData, size: inputValue })
    }

    // validateImage function
    function validateImage(event) {
        console.log(event, "===>");

        if (event.target.files && event.target.files[0]) {
            setAddErrors({ ...addErrors, imageError: "" })
        }
        else {
            setAddErrors({ ...addErrors, imageError: "Choose Image" })

        }
        setAddData({ ...addData, image: event.target.files[0] })
    }

    // validateCategory function
    function validateCategory(inputValue) {
        if (!inputValue) {
            setAddErrors({ ...addErrors, categoryError: "Enter Category" })
        }
        else {
            setAddErrors({ ...addErrors, categoryError: "" })
        }
        setAddData({ ...addData, category: inputValue })
    }

    // validateDescription function
    function validateDescription(inputValue) {
        if (!inputValue) {
            setAddErrors({ ...addErrors, descriptionError: "Enter Description" })
        }
        else {
            setAddErrors({ ...addErrors, descriptionError: "" })
        }
        setAddData({ ...addData, description: inputValue })

    }

    async function addProduct(event) {
        event.preventDefault()
        var errorObject = {}
        // console.log(addData);
        if (!addData.name) {
            errorObject['nameError'] = "Enter Product Name";
        }
        if (!addData.defaultPrice) {
            errorObject['defaultPriceError'] = "Enter Product Original Price";
        }
        if (addData.defaultPrice <= 0) {
            errorObject['defaultPriceError'] = "Enter Product Original Price > 0";
        }

        if (!addData.offer && addData.offer !== 0) {
            errorObject['offerError'] = "Enter Offer if no offer type 0";
        }
        if (addData.offer < 0 || addData.offer > 100) {
            errorObject['offerError'] = "Enter Offer > 0 < 100";
        }
        if (!addData.stock) {
            errorObject['stockError'] = "Enter Stock";
        }
        if (addData.stock <= 0) {
            errorObject['stockError'] = "Enter Stock > 0";
        }
        if (!addData.color) {
            errorObject['colorError'] = "Select Color";
        }
        if (!addData.size) {
            errorObject['sizeError'] = "Select Size";
        }
        if (!addData.image) {
            errorObject['imageError'] = "Choose Image";
        }
        if (!addData.category) {
            errorObject['categoryError'] = "Enter Category";
        }
        if (!addData.description) {
            errorObject['descriptionError'] = "Enter Description";
        }

        setAddErrors(errorObject);

        var values = Object.values(addErrors);
        var boolean = values.some((data, index) => data !== "")
        if (!boolean) {
            console.log(addData);
            const formData = new FormData();
            formData.append("name", addData.name);
            formData.append("price", addData.price);
            formData.append("defaultPrice", addData.defaultPrice);
            formData.append("offer", addData.offer);
            formData.append("description", addData.description);
            formData.append("stock", addData.stock);
            formData.append("color", addData.color);
            formData.append("size", addData.size);
            formData.append("category", addData.category);
            formData.append("image", addData.image);
            try {
                const token = localStorage.getItem('loginToken');
                const dataAdd = await axios.post("http://localhost:5000/addProducts", formData, {
                    headers: {
                        Authorization: token
                    }
                })
                alert(dataAdd.data.message)
                getAllProducts();
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

    }

    // add image removeImage function
    function removeImage() {
        setAddData({ ...addData, image: "" })
        setAddErrors({ ...addErrors, imageError: "Choose Image" })
    }

    // edit image removeImage function
    function removeEditImage(product) {
        setGetParticularProduct({ ...getParticularProduct, image: "" })
        setEditErrors({ ...editErrors, imageError: "Choose Image" })
    }

    // edit product validation functions

    // validateName function
    function editValidateName(inputValue) {
        if (!inputValue) {
            setEditErrors({ ...editErrors, nameError: "Enter Product Name" })
        }
        else {
            setEditErrors({ ...editErrors, nameError: "" })
        }
        setGetParticularProduct({ ...getParticularProduct, name: inputValue })
    }
    // validatePrice function
    function editValidateDefaultPrice(inputValue) {

        if (!inputValue) {
            setEditErrors({ ...editErrors, defaultPriceError: "Enter Product Original Price" })
        }
        else if (inputValue <= 0) {
            setEditErrors({ ...editErrors, defaultPriceError: "Enter Product Original Price > 0" })
        }
        else {
            setEditErrors({ ...editErrors, defaultPriceError: "" })
        }
        setGetParticularProduct({ ...getParticularProduct, defaultPrice: inputValue })
    }
    // validateOffer function
    function editValidateOffer(inputValue) {
        let offerPrice = getParticularProduct.defaultPrice;
        let originalPrice = getParticularProduct.defaultPrice;

        if (inputValue === "" || inputValue === null) {
            setEditErrors({ ...editErrors, offerError: "Enter Offer if no offer type 0" });
        }

        else if (inputValue < 0 || inputValue > 100) {
            setEditErrors({ ...editErrors, offerError: "Enter Offer between 0 and 100" });
        }

        else {
            offerPrice = Math.floor(originalPrice - (originalPrice * inputValue) / 100);
            setEditErrors({ ...editErrors, offerError: "" });
        }
        setGetParticularProduct({ ...getParticularProduct, offer: inputValue, price: offerPrice })
    }
    // validateStock function
    function editValidateStock(inputValue) {
        if (!inputValue) {
            setEditErrors({ ...editErrors, stockError: "Enter Stock" })
        }
        else if (inputValue <= 0) {
            setEditErrors({ ...editErrors, stockError: "Enter Stock > 0" })
        }
        else {
            setEditErrors({ ...editErrors, stockError: "" })
        }
        setGetParticularProduct({ ...getParticularProduct, stock: inputValue })
    }

    // validateColor function
    function editValidateColor(inputValue) {
        if (!inputValue) {
            setEditErrors({ ...editErrors, colorError: "Select Color" })
        }
        else {
            setEditErrors({ ...editErrors, colorError: "" })
        }
        setGetParticularProduct({ ...getParticularProduct, color: inputValue })
    }

    // validateSize function
    function editValidateSize(inputValue) {
        if (!inputValue) {
            setEditErrors({ ...editErrors, sizeError: "Select Size" })
        }
        else {
            setEditErrors({ ...editErrors, sizeError: "" })
        }
        setGetParticularProduct({ ...getParticularProduct, size: inputValue })
    }

    // validateImage function
    function editValidateImage(event) {
        console.log(event, "===>");

        if (event.target.files && event.target.files[0]) {
            setEditErrors({ ...editErrors, imageError: "" })
        }
        else {
            setEditErrors({ ...editErrors, imageError: "Choose Image" })

        }
        setGetParticularProduct({ ...getParticularProduct, image: event.target.files[0] })
    }

    // validateCategory function
    function editValidateCategory(inputValue) {
        if (!inputValue) {
            setEditErrors({ ...editErrors, categoryError: "Enter Category" })
        }
        else {
            setEditErrors({ ...editErrors, categoryError: "" })
        }
        setGetParticularProduct({ ...getParticularProduct, category: inputValue })
    }

    // validateDescription function
    function editValidateDescription(inputValue) {
        if (!inputValue) {
            setEditErrors({ ...editErrors, descriptionError: "Enter Description" })
        }
        else {
            setEditErrors({ ...editErrors, descriptionError: "" })
        }
        setGetParticularProduct({ ...getParticularProduct, description: inputValue })
    }

    async function updateProduct(event) {
        event.preventDefault()
        var errorObject = {}
        // console.log(addData);
        if (!getParticularProduct.name) {
            errorObject['nameError'] = "Enter Product Name";
        }
        if (!getParticularProduct.defaultPrice) {
            errorObject['defaultPriceError'] = "Enter Product Original Price";
        }
        if (getParticularProduct.defaultPrice <= 0) {
            errorObject['defaultPriceError'] = "Enter Product Original Price > 0";
        }

        if (!getParticularProduct.offer && getParticularProduct.offer !== 0) {
            errorObject['offerError'] = "Enter Offer if no offer type 0";
        }
        if (getParticularProduct.offer < 0 || getParticularProduct.offer > 100) {
            errorObject['offerError'] = "Enter Offer > 0 < 100";
        }
        if (!getParticularProduct.stock) {
            errorObject['stockError'] = "Enter Stock";
        }
        if (getParticularProduct.stock <= 0) {
            errorObject['stockError'] = "Enter Stock > 0";
        }
        if (!getParticularProduct.color) {
            errorObject['colorError'] = "Select Color";
        }
        if (!getParticularProduct.size) {
            errorObject['sizeError'] = "Select Size";
        }
        if (!getParticularProduct.image) {
            errorObject['imageError'] = "Choose Image";
        }
        if (!getParticularProduct.category) {
            errorObject['categoryError'] = "Enter Category";
        }
        if (!getParticularProduct.description) {
            errorObject['descriptionError'] = "Enter Description";
        }

        setEditErrors(errorObject);

        var values = Object.values(editErrors);
        var boolean = values.some((data, index) => data !== "")
        if (!boolean) {
            console.log(getParticularProduct);
            const formData = new FormData();
            formData.append("name", getParticularProduct.name);
            formData.append("price", getParticularProduct.price);
            formData.append("defaultPrice", getParticularProduct.defaultPrice);
            formData.append("offer", getParticularProduct.offer);
            formData.append("description", getParticularProduct.description);
            formData.append("stock", getParticularProduct.stock);
            formData.append("color", getParticularProduct.color);
            formData.append("size", getParticularProduct.size);
            formData.append("category", getParticularProduct.category);
            formData.append("image", getParticularProduct.image);
            try {
                const token = localStorage.getItem('loginToken');
                const dataEdit = await axios.post("http://localhost:5000/upateProducts", formData, {
                    headers: {
                        Authorization: token
                    }
                })
                alert(dataEdit.data.message)
                getAllProducts();
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

    }

    async function getAllProducts() {
        try {
            const token = localStorage.getItem('loginToken');
            const getData = await axios.get(`http://localhost:5000/getAllProducts?page=${currentPage}`, {
                headers: {
                    Authorization: token
                }
            })
            var allData = getData.data.data
            var totalPages = getData.data.totalPage / 5
            console.log(allData);
            console.log(totalPages);
            
            setAllProducts(allData)
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


    function authUser() {
        var user = JSON.parse(localStorage.getItem('loginUser'))
        var token = localStorage.getItem('loginToken')
        console.log(user, "===>");

        if (user && token) {
            if (user.role.toLowerCase() !== "admin") {
                navigate("/");
            }
            else if (user.role.toLowerCase() === "admin") {
                getAllProducts();
            }
        }
        else {
            navigate('/login')
        }
    }

    useEffect(() => {
        try {
            authUser();
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
                    <h2 className="text-lg font-semibold"> <i className="fa-brands fa-product-hunt"></i> Products</h2>
                    <button className="text-white bg-blue-500 font-bold px-3 py-3 rounded" onClick={() => {
                        openAddModal()
                    }}>
                        <i className="fa-solid fa-plus"></i> Add Product
                    </button>
                </div>

                {/* cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-base sm:text-lg font-semibold"> <i className="fa-solid fa-shirt text-2xl"></i> Total Products Count</h2>
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
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allProducts.length > 0 ? (allProducts.map((data, index) => {
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
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.category}
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
                                })) : (<p className='text-red-600'>No Products</p>)}

                            </tbody>

                        </table>

                    </div>
                </div>

                <div className="flex items-center justify-between border-t bg-white px-4 py-3">

                    <div className="sm:flex sm:flex-1 sm:justify-end">

                        {/* pagination */}
                        {totalPagesArrray.length > 0 && (
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
                                        onClick={() => setCurrentPage(index + 1)}
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


                {/* delete confirmation modal */}
                {deleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[60%] p-6 relative">
                            <button className="absolute top-4 right-4 justify-end text-black" onClick={() => {
                                closeViewModal()
                            }}>
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {getParticularProduct.image && (
                                    <img
                                        src={`http://localhost:5000/uploadingImages/${getParticularProduct.image}`}
                                        alt="product"
                                        className="w-full rounded-lg"
                                    />
                                )}
                                <div>
                                    <h2 className="text-2xl text-gray-900">
                                        <span className='font-bold'>Name : </span>
                                        {getParticularProduct.name}
                                    </h2>

                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Offer : </span>
                                        {getParticularProduct.offer} <i className="fa-solid fa-percent"></i> off
                                    </p>
                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Sale Price : </span>
                                        <i className="fa-solid fa-indian-rupee-sign"></i> {getParticularProduct.price}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Original Price : </span>
                                        <i className="fa-solid fa-indian-rupee-sign"></i> {getParticularProduct.defaultPrice}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>colors : </span>
                                        {getParticularProduct.color}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Sizes : </span>
                                        {getParticularProduct.size}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Category : </span>
                                        {getParticularProduct.category}
                                    </p>

                                    <p className="mt-4 text-black text-lg">
                                        <span className='font-bold'>Description: </span>
                                        {getParticularProduct.description}
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                )}

                {/* edit product modal */}
                {editModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

                            <button
                                onClick={() => closeEditModal()}
                                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                            <form onSubmit={(event) => { updateProduct(event) }}>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter name"
                                        value={getParticularProduct.name}
                                        onInput={(event) => {
                                            editValidateName(event.target.value)
                                        }}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.nameError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter default price"
                                        min="1"
                                        value={getParticularProduct.defaultPrice}
                                        onInput={(event) => {
                                            editValidateDefaultPrice(event.target.value)
                                        }}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.defaultPriceError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter sale price"
                                        readOnly
                                        value={getParticularProduct.price}
                                    />
                                </div>

                                <div className="block">
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter offer"
                                        min="0"
                                        onInput={(event) => {
                                            editValidateOffer(event.target.value)
                                        }}
                                        value={getParticularProduct.offer}

                                    />

                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.offerError}
                                    </p>
                                </div>
                                <div className="block">
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter stock"
                                        min="1"
                                        onInput={(event) => {
                                            editValidateStock(event.target.value)
                                        }}
                                        value={getParticularProduct.stock}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.stockError}
                                    </p>
                                </div>
                                <div className="block sm:w-100">
                                    <select className="w-full border rounded px-3 py-2" onChange={(event) => {
                                        editValidateColor(event.target.value)
                                    }} value={getParticularProduct.color}>
                                        <option value="">Select Color</option>
                                        <option value="blue">blue</option>
                                        <option value="red">red</option>
                                        <option value="green">green</option>
                                        <option value="yellow">yellow</option>
                                        <option value="orange">orange</option>
                                        <option value="white">white</option>
                                    </select>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.colorError}
                                    </p>
                                </div>
                                <div className="block sm:w-100">
                                    <select className="w-full border rounded px-3 py-2" onChange={(event) => {
                                        editValidateSize(event.target.value)
                                    }} value={getParticularProduct.size}>
                                        <option value="">Select Size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="L">40</option>
                                        <option value="L">42</option>
                                        <option value="XL">XL</option>
                                    </select>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.sizeError}
                                    </p>
                                </div>
                                <div className="block">
                                    <input
                                        type="file"
                                        className="w-full border rounded px-3 py-2"
                                        onChange={(event) => {
                                            editValidateImage(event)
                                        }}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.imageError}
                                    </p>
                                    {getParticularProduct.image && (
                                        <div className="relative inline-block">
                                            <img src={
                                                typeof (getParticularProduct.image) === "string"
                                                    ? `http://localhost:5000/uploadingImages/${getParticularProduct.image}`
                                                    : URL.createObjectURL(getParticularProduct.image)
                                            }
                                                alt="Thumb"
                                                className="w-24 h-24 object-cover rounded-lg border shadow"
                                            />
                                            <button className="absolute bg-red-500 text-white text-xs h-6 px-3 py-3 ms-3 rounded flex items-center justify-center shadow hover:bg-red-600" onClick={() => { removeEditImage(getParticularProduct) }}>
                                                Remove
                                            </button>

                                        </div>

                                    )}
                                </div>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter category"
                                        onInput={(event) => {
                                            editValidateCategory(event.target.value)
                                        }}
                                        value={getParticularProduct.category}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.categoryError}
                                    </p>
                                </div>
                                <div className="block">
                                    <textarea className="w-full border rounded px-3 py-2" placeholder='Enter description' onInput={(event) => {
                                        editValidateDescription(event.target.value)
                                    }} value={getParticularProduct.description}></textarea>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {editErrors.descriptionError}
                                    </p>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

                            <button
                                onClick={() => closeAddModal()}
                                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Add Product</h2>

                            <form onSubmit={(event) => { addProduct(event) }}>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter name"
                                        value={getParticularProduct.name}
                                        onInput={(event) => {
                                            validateName(event.target.value)
                                        }}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.nameError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter default price"
                                        min="1"
                                        value={addData.defaultPrice}
                                        onInput={(event) => {
                                            validateDefaultPrice(event.target.value)
                                        }}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.defaultPriceError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter sale price"
                                        readOnly
                                        value={addData.price}
                                    />
                                </div>

                                <div className="block">
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter offer"
                                        min="0"
                                        onInput={(event) => {
                                            validateOffer(event.target.value)
                                        }}
                                        value={addData.offer}

                                    />

                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.offerError}
                                    </p>
                                </div>
                                <div className="block">
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter stock"
                                        min="1"
                                        onInput={(event) => {
                                            validateStock(event.target.value)
                                        }}
                                        value={addData.stock}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.stockError}
                                    </p>
                                </div>
                                <div className="block sm:w-100">
                                    <select className="w-full border rounded px-3 py-2" onChange={(event) => {
                                        validateColor(event.target.value)
                                    }} value={addData.color}>
                                        <option value="">Select Color</option>
                                        <option value="blue">blue</option>
                                        <option value="red">red</option>
                                        <option value="green">green</option>
                                        <option value="yellow">yellow</option>
                                        <option value="orange">orange</option>
                                        <option value="white">white</option>
                                    </select>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.colorError}
                                    </p>
                                </div>
                                <div className="block sm:w-100">
                                    <select className="w-full border rounded px-3 py-2" onChange={(event) => {
                                        validateSize(event.target.value)
                                    }} value={addData.size}>
                                        <option value="">Select Size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="L">40</option>
                                        <option value="L">42</option>
                                        <option value="XL">XL</option>
                                    </select>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.sizeError}
                                    </p>
                                </div>
                                <div className="block">
                                    <input
                                        type="file"
                                        className="w-full border rounded px-3 py-2"
                                        onChange={(event) => {
                                            validateImage(event)
                                        }}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.imageError}
                                    </p>
                                    {addData.image && (
                                        <div className="relative inline-block">
                                            <img
                                                src={URL.createObjectURL(addData.image)}
                                                alt="Thumb"
                                                className="w-24 h-24 object-cover rounded-lg border shadow"
                                            />
                                            <button className="absolute bg-red-500 text-white text-xs h-6 px-3 py-3 ms-3 rounded flex items-center justify-center shadow hover:bg-red-600" onClick={() => { removeImage() }}>
                                                Remove
                                            </button>

                                        </div>
                                    )}
                                </div>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter category"
                                        onInput={(event) => {
                                            validateCategory(event.target.value)
                                        }}
                                        value={addData.category}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.categoryError}
                                    </p>
                                </div>
                                <div className="block">
                                    <textarea className="w-full border rounded px-3 py-2" placeholder='Enter description' onInput={(event) => {
                                        validateDescription(event.target.value)
                                    }} value={addData.description}></textarea>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {addErrors.descriptionError}
                                    </p>
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

                {/* footer section */}
                <AdminFooter />

            </div>
        </div>
    );
};

