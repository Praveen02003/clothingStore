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
    // alert
    const [openAlert, setOpenAlert] = useState(false)
    const [alertColor, setAlertColor] = useState("")
    const [alertContent, setAlertContent] = useState("")

    const [loginUser, setLoginUser] = useState({})

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

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [dynamicPageNumber, setDynamicPageNumber] = useState(5);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [startValue, setStartValue] = useState(0);
    const [endValue, setEndValue] = useState(0);

    // filter and search
    const [finalPrice, setFinalPrice] = useState("");
    const [finalCategory, setFinalCategory] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [searchData, setSearchData] = useState("");

    const [spinnerLoader, setSpinnerLoader] = useState(false);


    // search function
    function search(inputValue) {
        setCurrentPage(1)
        setTimeout(() => {
            setCategory("")
            setPrice("")
            setSearchData(inputValue)
        }, 1500);
    }

    // priceApply function
    function priceApply(inputValue) {
        setFinalPrice(inputValue)
    }

    // categoryApply function
    function categoryApply(inputValue) {
        setFinalCategory(inputValue)
    }

    // applyFilter function
    function applyFilter() {
        setCurrentPage(1)
        setSearchData("")
        setCategory(finalCategory)
        setPrice(finalPrice)
    }
    // clearFilter function
    function clearFilter() {
        setFinalCategory("");
        setFinalPrice("");
        setCategory("");
        setPrice("");
    }


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
            // alert(error.response.data.message)
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
            // alert(deleteOneData.data.message)
            if (deleteOneData.data.message === "Product Deleted Successfully") {
                setAlertContent(deleteOneData.data.message)
                setOpenAlert(true)
                setTimeout(() => {
                    setOpenAlert(false)
                    closeDeleteModal();
                }, 2000);
            }
            else {
                setAlertContent(deleteOneData.data.message)
                setOpenAlert(true)
                setTimeout(() => {
                    setOpenAlert(false)
                }, 2000);
            }
            getAllProducts();

        } catch (error) {
            console.log(error.response.data.message);
            // alert(error.response.data.message)
            if (error.response.data.message === "Access denied") {
                logOut()
            }
            else if (error.response.data.message === "Invalid token") {
                logOut()
            }
        }
    }

    // view modal
    async function openViewModal(id) {
        setSpinnerLoader(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await particularProduct(id)
            setViewModal(true)
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoader(false);
        }
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
    async function openEditModal(id) {
        setSpinnerLoader(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await particularProduct(id)
            setEditModal(true)
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoader(false);
        }
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
        setAddErrors({
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

        setAddData({
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
        })
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('sidebarOpen')
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

        var values = Object.values(errorObject);
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
            if (addData.image) {
                formData.append("image", addData.image);
            }
            console.log(formData);

            try {
                const token = localStorage.getItem('loginToken');
                const dataAdd = await axios.post("http://localhost:5000/addProducts", formData, {
                    headers: {
                        Authorization: token,
                        "Content-Type": "multipart/form-data"
                    }
                })
                // alert(dataAdd.data.message)
                setAlertContent(dataAdd.data.message)
                setOpenAlert(true)
                setTimeout(() => {
                    setOpenAlert(false)
                }, 2000);
                getAllProducts();
            } catch (error) {
                console.log(error.response.data.message);
                // alert(error.response.data.message)
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

        var values = Object.values(errorObject);
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
                if (dataEdit.data.message === "Product Updated Successfully") {

                    setAlertContent(dataEdit.data.message)
                    setOpenAlert(true)
                    setTimeout(() => {
                        setOpenAlert(false)
                        closeEditModal()
                    }, 2000);
                }
                else {
                    setAlertContent(dataEdit.data.message)
                    setOpenAlert(true)
                    setTimeout(() => {
                        setOpenAlert(false)
                    }, 2000);
                }
                getAllProducts();
            } catch (error) {
                console.log(error.response.data.message);
                // alert(error.response.data.message)
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
        setSpinnerLoader(true)
        try {
            const token = localStorage.getItem('loginToken');
            const getData = await axios.get(`http://localhost:5000/getAllProducts?page=${currentPage}&category=${category}&price=${price}&search=${searchData}&count=${dynamicPageNumber}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(getData.data.data, "--->");

            // pagination concept
            var allData = getData.data.data
            var totalNumberOfData = getData.data.totalPage
            var totalPagesData = Math.ceil(getData.data.totalPage / dynamicPageNumber)

            var calculateStart = (currentPage - 1) * dynamicPageNumber + 1
            var calculateEnd = (parseInt(calculateStart) + parseInt(dynamicPageNumber)) - 1

            setStartValue(calculateStart)
            setEndValue(calculateEnd)
            setAllProducts(allData)
            setTotalPages(totalPagesData)
            setTotalDataCount(totalNumberOfData)
            setSpinnerLoader(false)
        } catch (error) {
            console.log(error.response.data.message);
            // alert(error.response.data.message)
            if (error.response.data.message === "Access denied") {
                logOut()
            }
            else if (error.response.data.message === "Invalid token") {
                logOut()
            }
        }
    }

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
            setLoginUser(user)
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
    }, [currentPage, category, price, searchData, dynamicPageNumber])

    return (
        <div className={`flex-1 transition-all duration-300 
            ${open ? "ml-64" : "ml-16"}`}>

            {/* sidebar */}
            <Sidebar />

            {spinnerLoader && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                </div>
            )}

            <div className="flex flex-col flex-1">

                <AdminNavbar />

                <div className="flex flex-wrap items-center justify-between gap-4 p-4">

                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <i className="fa-brands fa-product-hunt"></i>
                        Products
                    </h2>

                    <div className="flex flex-wrap items-center gap-3">

                        {/* search */}
                        <input
                            type="search"
                            placeholder="Search by name, category"
                            className="w-48 border border-black rounded px-3 py-2 text-sm"
                            onInput={(event) => { search(event.target.value) }}
                        />

                        {/* category select */}
                        <select
                            className="w-40 border border-black rounded-md px-3 py-2 text-sm"
                            value={finalCategory}
                            onChange={(event) => categoryApply(event.target.value)}
                        >
                            <option value="">Select Category</option>
                            <option value="kurti">Kurti</option>
                            <option value="tshirt">T-Shirt</option>
                            <option value="jeans">Jeans</option>
                            <option value="shirt">Shirt</option>
                            <option value="hoodie">Hoodie</option>
                            <option value="pants">Pants</option>
                            <option value="jacket">Jacket</option>
                        </select>

                        {/* price select */}
                        <select
                            className="w-40 border border-black rounded-md px-3 py-2 text-sm"
                            value={finalPrice}
                            onChange={(event) => priceApply(event.target.value)}
                        >
                            <option value="">Select Price</option>
                            <option value="lowest">Lowest</option>
                            <option value="highest">Highest</option>
                        </select>

                        <button className='bg-blue-500 px-4 py-2 rounded text-white' onClick={() => {
                            applyFilter()
                        }}>
                            Apply
                        </button>
                        {(category || price) && (
                            <button className='bg-blue-500 px-4 py-2 rounded text-white' onClick={() => {
                                clearFilter()
                            }}>
                                Clear
                            </button>
                        )}

                        <button className="text-white bg-green-700 font-bold px-3 py-2 rounded" onClick={() => {
                            openAddModal()
                        }}>
                            <i className="fa-solid fa-plus"></i> Add Product
                        </button>

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
                                <tr className='bg-gray-600 text-white'>
                                    <th className="px-6 py-3">S.no</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Action</th>
                                    <th className="px-6 py-3">Added By</th>
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
                                                <i class="fa-solid fa-dollar-sign"></i> {data.price}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.stock}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.category}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button className="text-green-900 me-5 font-bold hover:underline" onClick={() => openViewModal(data._id)}>
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                                <button className="text-blue-600 me-5 font-bold hover:underline" onClick={() => openEditModal(data._id)}>
                                                    <i className="fa-solid fa-marker"></i>
                                                </button>
                                                <button className="text-red-600 me-5 font-bold hover:underline" onClick={() => openDeleteModal(data._id)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {data.user[0].email}
                                            </td>
                                        </tr>
                                    )
                                })) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-red-600 font-bold text-xl">
                                            No Products
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                </div>

                {/* pagination */}
                {allProducts.length > 0 && (
                    <div className="flex justify-between items-center border-t p-4 bg-white">

                        <div className="sm:flex justify-between items-center w-full">
                            <h2 className="flex items-center gap-1 whitespace-nowrap">
                                showing <b>{startValue}</b> - <b>{endValue}</b> of <b>{totalDataCount}</b>
                            </h2>
                            <div className="flex items-center gap-6">

                                <select className="border rounded px-2 py-1" onChange={(event) => {
                                    setDynamicPageNumber(event.target.value)
                                    setCurrentPage(1)
                                }} value={dynamicPageNumber}>
                                    <option>5</option>
                                    <option>10</option>
                                    <option>20</option>
                                </select>

                                <button className="border px-3 py-1 rounded" onClick={() => {
                                    previous()
                                }} disabled={currentPage === 1}>previous</button>

                                <h2 className="flex items-center gap-1 whitespace-nowrap">
                                    page <b>{currentPage}</b> of <b>{totalPages}</b>
                                </h2>

                                <button className="border px-3 py-1 rounded" onClick={() => {
                                    next()
                                }} disabled={currentPage === totalPages}>next</button>
                            </div>
                        </div>

                    </div>
                )}



                {/* delete confirmation modal */}
                {deleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                        <div className="bg-white rounded-lg shadow-xl p-6">

                            <div className="flex items-start gap-4">
                                <div>
                                    {/* alert */}
                                    {openAlert && (
                                        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                            <span class="block sm:inline">{alertContent}</span>
                                        </div>
                                    )}
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
                                        <i class="fa-solid fa-dollar-sign"></i> {getParticularProduct.price}
                                    </p>
                                    <p className="text-xl mt-2 text-gray-900">
                                        <span className='font-bold'>Original Price : </span>
                                        <i class="fa-solid fa-dollar-sign"></i> {getParticularProduct.defaultPrice}
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
                                className="absolute top-4 right-4 text-gray-500"
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                            {/* alert */}
                            {openAlert && (
                                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <span class="block sm:inline">{alertContent}</span>
                                </div>
                            )}
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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

                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                            <button className="absolute top-1 right-1 bg-red-500 text-white text-xs h-6 px-3 py-3 ms-3 rounded flex items-center justify-center shadow hover:bg-red-600" onClick={() => { removeEditImage(getParticularProduct) }}>
                                                <i class="fa-solid fa-xmark"></i>
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
                                    <p className="text-sm text-red-500 mb-0">
                                        {editErrors.categoryError}
                                    </p>
                                </div>
                                <div className="block">
                                    <textarea className="w-full border rounded px-3 py-2" placeholder='Enter description' onInput={(event) => {
                                        editValidateDescription(event.target.value)
                                    }} value={getParticularProduct.description}></textarea>
                                    <p className="text-sm text-red-500 mb-0">
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
                                className="absolute top-4 right-4 text-gray-500"
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Add Product</h2>
                            {/* alert */}
                            {openAlert && (
                                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <span class="block sm:inline">{alertContent}</span>
                                </div>
                            )}

                            <form onSubmit={(event) => { addProduct(event) }}>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter name"
                                        value={addData.name}
                                        onInput={(event) => {
                                            validateName(event.target.value)
                                        }}
                                    />
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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

                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
                                        {addErrors.imageError}
                                    </p>
                                    {addData.image && (
                                        <div className="relative inline-block">
                                            <img
                                                src={URL.createObjectURL(addData.image)}
                                                alt="Thumb"
                                                className="w-24 h-24 object-cover rounded-lg border shadow"
                                            />
                                            <button className="absolute top-1 right-1 bg-red-500 text-white text-xs h-6 px-3 py-3 ms-3 rounded flex items-center justify-center shadow hover:bg-red-600" onClick={() => { removeImage() }}>
                                                <i class="fa-solid fa-xmark"></i>
                                            </button>

                                        </div>
                                    )}
                                </div>

                                <div className="block mt-4">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter category"
                                        onInput={(event) => {
                                            validateCategory(event.target.value)
                                        }}
                                        value={addData.category}
                                    />
                                    <p className="text-sm text-red-500 mb-0">
                                        {addErrors.categoryError}
                                    </p>
                                </div>
                                <div className="block">
                                    <textarea className="w-full border rounded px-3 py-2" placeholder='Enter description' onInput={(event) => {
                                        validateDescription(event.target.value)
                                    }} value={addData.description}></textarea>
                                    <p className="text-sm text-red-500 mb-0">
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

