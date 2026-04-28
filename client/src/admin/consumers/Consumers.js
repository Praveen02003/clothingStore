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

    var allErrors = {
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        mobileError: "",
        genderError: "",
        passwordError: "",
        confirmPasswordError: "",
        addressError: "",
        termsError: ""
    };

    const navigate = useNavigate();

    var [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        gender: "",
        password: "",
        confirmPassword: "",
        address: "",
        terms: ""
    });

    var [error, setError] = useState({
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        mobileError: "",
        genderError: "",
        passwordError: "",
        confirmPasswordError: "",
        addressError: "",
        termsError: ""

    });


    // validateFirstName function
    function validateFirstName(value) {

        var allErrors = { ...error }
        var inputValue = value;

        setFormData({ ...formData, firstName: inputValue })

        if (!inputValue) {
            allErrors.firstNameError = 'Enter First Name';
        }
        else {
            allErrors.firstNameError = "";
        }
        setError(allErrors)
    }


    // validateLastName function
    function validateLastName(value) {

        var allErrors = { ...error }
        var inputValue = value;

        setFormData({ ...formData, lastName: inputValue })

        if (!inputValue) {
            allErrors.lastNameError = 'Enter Last Name';
        }
        else {
            allErrors.lastNameError = "";
        }
        setError(allErrors)
    }


    // validateEmail function
    function validateEmail(value) {
        let allErrors = { ...error };
        let inputValue = value;

        setFormData({ ...formData, email: inputValue })

        if (!inputValue) {
            allErrors.emailError = 'Enter Email';
        }
        else if (inputValue && !inputValue.includes('@')) {
            allErrors.emailError = 'Email must contain @';
        }
        else if (inputValue && inputValue.includes(" ")) {
            allErrors.emailError = "Email should not contain space";
        }
        else if (inputValue.indexOf('@') !== inputValue.lastIndexOf('@')) {
            allErrors.emailError = "Email must contain only one '@'";
        }
        else {
            let split_email = inputValue.split("@");

            if (!split_email[0]) {
                allErrors.emailError = "Email should not start with '@'";
            }
            else if (!split_email[1]) {
                allErrors.emailError = "Enter domain name after '@'";
            }
            else if (!split_email[1].includes(".")) {
                allErrors.emailError = "Domain must contain '.'";
            }
            else if (split_email[0].startsWith(".")) {
                allErrors.emailError = "Email should not start with '.'";
            }
            else if (split_email[1].startsWith(".") || split_email[1].endsWith(".")) {
                allErrors.emailError = "Invalid domain format";
            }
            else {
                let domainparts = split_email[1].split(".");
                let extension = domainparts[domainparts.length - 1];

                if (!extension) {
                    allErrors.emailError = "Extension cannot be empty";
                }
                else {
                    allErrors.emailError = "";
                }
            }
        }

        setError(allErrors);
    }

    // validateMobileNumber function
    function validateMobileNumber(inputvalue, event) {

        let allErrors = { ...error };


        var finalnumber = "";
        var formattednumber = "";

        if (!inputvalue) {
            allErrors.mobileError = "Enter Mobile Number";
            setError(allErrors)
            setFormData({ ...formData, mobile: formattednumber })
            return;
        }

        let numbers = inputvalue.split("").filter(item => (item >= '0') && (item <= '9')).join("");

        finalnumber = numbers.slice(0, 10);

        if (finalnumber.length > 6) {
            formattednumber = "(" + finalnumber.slice(0, 3) + ") " + finalnumber.slice(3, 6) + "-" + finalnumber.slice(6);
        }
        else if (finalnumber.length > 3) {
            formattednumber = "(" + finalnumber.slice(0, 3) + ") " + finalnumber.slice(3);
        }
        else {
            formattednumber = finalnumber;
        }

        if (inputvalue && finalnumber.length < 10) {
            allErrors.mobileError = "Mobile Number must be 10 digits";
        } else {
            allErrors.mobileError = "";
        }

        setFormData({ ...formData, mobile: formattednumber })

        setError(allErrors)
    }

    // validateGender function
    function validateGender(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.genderError = "Select Gender";
        }
        else {
            allErrors.genderError = "";
        }

        setFormData({ ...formData, gender: inputvalue })

        setError(allErrors)
    }

    // validateTerms
    function validateTerms(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.termsError = "Accept terms and condition";
        }
        else {
            allErrors.termsError = "";
        }

        setFormData({ ...formData, terms: inputvalue })

        setError(allErrors)
    }


    // validatePassword function
    function validatePassword(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.passwordError = 'Enter Password';
        }
        else if (inputvalue && inputvalue.length < 8) {
            allErrors.passwordError = 'Password must be at least 8 characters';
        }
        else if (!/\d/.test(inputvalue)) {
            allErrors.passwordError = "Password must contain at least one number";
        }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(inputvalue)) {
            allErrors.passwordError = "Password must contain at least one special character";
        }
        else {
            allErrors.passwordError = "";
        }
        setFormData({ ...formData, password: inputvalue })

        setError(allErrors)
    }

    // validateConfirmPassword
    function validateConfirmPassword(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.confirmPasswordError = 'Enter Confirm-Password';
        }
        else if (formData.password !== inputvalue) {
            allErrors.confirmPasswordError = "Passwords do not match";
        }
        else {
            allErrors.confirmPasswordError = "";
        }

        setFormData({ ...formData, confirmPassword: inputvalue })

        setError(allErrors)
    }

    // validateAddress
    function validateAddress(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.addressError = 'Enter address';
        }
        else {
            allErrors.addressError = "";
        }

        setFormData({ ...formData, address: inputvalue })

        setError(allErrors)
    }

    // submitForm function
    async function submitForm(event) {
        event.preventDefault();

        let allErrors = { ...error };

        if (!formData.firstName) {
            allErrors.firstNameError = "Enter First Name";
        }

        if (!formData.lastName) {
            allErrors.lastNameError = "Enter Last Name";
        }

        const email = formData.email;

        if (!email) {
            allErrors.emailError = "Enter Email";
        } else if (!email.includes("@")) {
            allErrors.emailError = "Email must contain @";
        } else if (email.includes(" ")) {
            allErrors.emailError = "Email should not contain space";
        } else if (email.indexOf("@") !== email.lastIndexOf("@")) {
            allErrors.emailError = "Only one @ allowed";
        } else {
            const parts = email.split("@");

            if (!parts[0]) {
                allErrors.emailError = "Invalid email format";
            } else if (!parts[1] || !parts[1].includes(".")) {
                allErrors.emailError = "Invalid domain";
            } else {
                allErrors.emailError = "";
            }
        }

        if (!formData.mobile) {
            allErrors.mobileError = "Enter Mobile Number";
        } else {
            const digits = formData.mobile.replace(/\D/g, "");
            if (digits.length < 10) {
                allErrors.mobileError = "Mobile must be 10 digits";
            } else {
                allErrors.mobileError = "";
            }
        }

        if (!formData.gender) {
            allErrors.genderError = "Select Gender";
        }

        if (!formData.password) {
            allErrors.passwordError = 'Enter Password';
        }


        if (!formData.confirmPassword) {
            allErrors.confirmPasswordError = 'Enter Confirm-Password';
        }
        if (formData.password && formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                allErrors.confirmPasswordError = "Passwords do not match";
            }
        }


        if (!formData.terms) {
            allErrors.termsError = "Accept terms and condition";
        }

        if (!formData.address) {
            allErrors.addressError = 'Enter address';
        }

        setError(allErrors);

        const checking = Object.values(allErrors).some(err => err !== "");

        if (!checking) {
            if (formData.password === formData.confirmPassword) {
                var replacedNumber = formData.mobile.replace(/\D/g, "")
                setFormData({ ...formData, mobile: replacedNumber })
                console.log(formData, "===>");
                try {
                    var result = await axios.post("http://localhost:5000/addUser", { data: formData });
                    console.log(result.data.message);
                    if (result.data.message === "New User Added Successfully") {
                        getAllConsumers()
                    }
                    setAlertContent(result.data.message)
                    setOpenAlert(true)
                    setTimeout(() => {
                        setOpenAlert(false)
                    }, 2000);
                } catch (error) {
                    alert(error);
                }
            }
        }
    }

    const [consumerModal, setConsumerModal] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [dynamicPageNumber, setDynamicPageNumber] = useState(5);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [startValue, setStartValue] = useState(0);
    const [endValue, setEndValue] = useState(0);

    const [searchData, setSearchData] = useState("");

    // alert
    const [openAlert, setOpenAlert] = useState(false)
    const [alertColor, setAlertColor] = useState("")
    const [alertContent, setAlertContent] = useState("")


    // add modal
    function openAddModal() {
        setConsumerModal(true)
    }

    function closeAddModal() {
        setConsumerModal(false)
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            gender: "",
            password: "",
            confirmPassword: "",
            address: "",
            terms: ""
        })

        setError({
            firstNameError: "",
            lastNameError: "",
            emailError: "",
            mobileError: "",
            genderError: "",
            passwordError: "",
            confirmPasswordError: "",
            addressError: "",
            termsError: ""

        })
    }


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
            const getData = await axios.get(`http://localhost:5000/getAllConsumers?page=${currentPage}&count=${dynamicPageNumber}&search=${searchData}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(getData.data.totalPage);

            // pagination concept
            var allData = getData.data.data
            var totalNumberOfData = getData.data.totalPage
            var totalPagesData = Math.ceil(getData.data.totalPage / dynamicPageNumber)

            var calculateStart = (currentPage - 1) * dynamicPageNumber + 1
            var calculateEnd = (parseInt(calculateStart) + parseInt(dynamicPageNumber)) - 1

            setStartValue(calculateStart)
            setEndValue(calculateEnd)
            setAllConsumers(allData)
            setTotalPages(totalPagesData)
            setTotalDataCount(totalNumberOfData)
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

    // next function
    function next() {
        setCurrentPage(currentPage + 1)
    }

    // previous function
    function previous() {
        setCurrentPage(currentPage - 1)
    }

    // search function
    function search(inputValue) {
        setCurrentPage(1)
        setTimeout(() => {
            setSearchData(inputValue)
        }, 1500);
    }


    useEffect(() => {
        try {
            authUser()
        } catch (error) {
            console.log("error");
        }
    }, [currentPage, dynamicPageNumber, searchData])

    return (
        <div className={`flex-1 transition-all duration-300 
            ${open ? "ml-64" : "ml-16"}`}>

            {/* sidebar */}
            <Sidebar />

            <div className="flex flex-col flex-1">

                <AdminNavbar />


                <div className="flex flex-wrap items-center justify-between gap-4 p-4">

                    <h2 className="text-lg font-semibold"> <i className="fa-solid fa-users"></i> Consumers</h2>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* search */}
                        <input
                            type="search"
                            placeholder="Search by name, email"
                            className="w-48 border border-black rounded px-3 py-2 text-sm"
                            onInput={(event) => { search(event.target.value) }}
                        />

                        <button className="text-white bg-green-700 font-bold px-3 py-2 rounded" onClick={() => {
                            openAddModal()
                        }}>
                            <i className="fa-solid fa-plus"></i> Add Consumer
                        </button>

                    </div>

                </div>

                <div className="p-4">
                    <div className="max-h-96 overflow-y-auto overflow-x-auto shadow-md rounded-lg">

                        <table className="w-full text-sm text-left text-gray-500">

                            <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                                <tr className='text-center'>
                                    <th className="px-6 py-3">S.no</th>
                                    <th className="px-6 py-3">First Name</th>
                                    <th className="px-6 py-3">Last Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allConsumers.length > 0 ?
                                    (allConsumers.map((data, index) => {
                                        return (
                                            <tr className="bg-white text-center border-b hover:bg-gray-50" key={index}>

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
                                                    <button className="text-black me-5 font-bold hover:underline" onClick={() => openViewModal(data._id)}>
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })) :
                                    (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6 text-red-600 font-bold text-xl">
                                                No Consumers Found
                                            </td>
                                        </tr>

                                    )}

                            </tbody>

                        </table>

                    </div>
                </div>

                {/* pagination */}
                {allConsumers.length > 0 && (

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

                {/* add consumer modal */}
                {consumerModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

                            <button
                                onClick={() => closeAddModal()}
                                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Add Consumer</h2>
                            {/* alert */}
                            {openAlert && (
                                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <span class="font-bold block sm:inline">{alertContent}</span>
                                </div>
                            )}

                            <form onSubmit={(event) => {
                                submitForm(event)
                            }}>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="First Name"
                                        id="firstName"
                                        value={formData.firstName}
                                        onInput={(event) => { validateFirstName(event.target.value) }}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {error.firstNameError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Last Name"
                                        id="lastName"
                                        value={formData.lastName}
                                        onInput={(event) => { validateLastName(event.target.value) }}

                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {error.lastNameError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="email"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Email"
                                        id="email"
                                        value={formData.email}
                                        onInput={(event) => { validateEmail(event.target.value) }}

                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {error.emailError}
                                    </p>
                                </div>

                                <div className="block">
                                    <div className="flex items-center gap-2">
                                        <span>+1</span>
                                        <input
                                            type="tel"
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="Mobile"
                                            id="mobile"
                                            value={formData.mobile}
                                            onInput={(event) => { validateMobileNumber(event.target.value, event) }}
                                        />
                                    </div>

                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {error.mobileError}
                                    </p>
                                </div>
                                <div className="block sm:w-100">
                                    <select id="gender"
                                        value={formData.gender}
                                        onInput={(event) => { validateGender(event.target.value) }}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {error.genderError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="password"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Password"
                                        id="password"
                                        value={formData.password}
                                        onInput={(event) => { validatePassword(event.target.value) }}
                                    />
                                    <p className="text-sm text-red-500 font-bold">
                                        {error.passwordError}
                                    </p>
                                </div>
                                <div className="block">
                                    <input
                                        type="password"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Confirm-Password"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onInput={(event) => { validateConfirmPassword(event.target.value) }}
                                    />
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {error.confirmPasswordError}
                                    </p>
                                </div>
                                <div className="block">
                                    <textarea className="w-full border rounded px-3 py-2"
                                        placeholder="Enter address"
                                        id="address"
                                        value={formData.address}
                                        onInput={(event) => { validateAddress(event.target.value) }} ></textarea>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {error.addressError}
                                    </p>
                                </div>
                                <div className="block">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={formData.terms}
                                        onChange={(event) => { validateTerms(event.target.checked) }}
                                    />
                                    <label for="terms"> Terms & Conditions</label>
                                    <p className="text-sm text-red-500 font-bold mb-0">
                                        {error.termsError}
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

