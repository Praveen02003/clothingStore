import React, { useContext, useState } from 'react'
import { mainContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Navbar = () => {
    const {
        loginUser,
        setLoginUser,
        userProductAddModal,
        setUserProductAddModal,
    } = useContext(mainContext);


    // alert
    const [openAlert, setOpenAlert] = useState(false)
    const [alertColor, setAlertColor] = useState("")
    const [alertContent, setAlertContent] = useState("")

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
            try {
                const token = localStorage.getItem('loginToken');
                const dataAdd = await axios.post("http://localhost:5000/addProducts", formData, {
                    headers: {
                        Authorization: token
                    }
                })
                setAlertContent(dataAdd.data.message)
                setOpenAlert(true)
                setTimeout(() => {
                    setOpenAlert(false)
                }, 2000);
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


    const navigate = useNavigate()

    // add modal
    function openAddModal() {
        setUserProductAddModal(true)
    }
     function closeAddModal() {
        setUserProductAddModal(false)
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
        setLoginUser(null)
        navigate('/login')
    }

    // goToLoginPage function
    function goToLoginPage() {
        navigate('/login')
    }

    // goToSignupPage function
    function goToSignupPage() {
        navigate('/signup')
    }
    return (
        <div className="flex items-center justify-between p-6 bg-gray-700 border-b px-4">

            <div className="flex items-center gap-4">
                <h1 className="text-white font-bold"> <i className="fa-solid fa-truck-fast text-2xl"></i> Cartify</h1>
            </div>

            {/* logout button */}
            <div className="flex items-center gap-2">
                {!loginUser && (
                    <div>
                        <button className="bg-blue-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                            goToSignupPage()
                        }}>
                            <i className="fa-solid fa-user-plus"></i> Signup
                        </button>
                        <button className="bg-blue-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                            goToLoginPage()
                        }}>
                            Login
                        </button>
                    </div>
                )}
                {loginUser && (
                    <div>
                        <button className="bg-red-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                            logOut()
                        }}>
                            <i className="fa-solid fa-right-from-bracket"></i> Log Out
                        </button>
                    </div>
                )}
                {loginUser && (
                    <button className="text-white bg-green-700 font-bold px-3 py-2 rounded" onClick={() => {
                        openAddModal()
                    }}>
                        <i className="fa-solid fa-plus"></i> Add Product
                    </button>
                )}
            </div>

            {/* add product modal */}
            {userProductAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                    <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

                        <button
                            onClick={() => closeAddModal()}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            <i className="fa-solid fa-circle-xmark"></i>
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add Product</h2>

                        {/* alert */}
                        {openAlert && (
                            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <span class="font-bold block sm:inline">{alertContent}</span>
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
        </div>
    )
}
