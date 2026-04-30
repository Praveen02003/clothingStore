import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import axios from 'axios';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';

export const Address = () => {

    const {
        sideBarOpen,
        setSideBarOpen,
        loginUser,
        setLoginUser,
        updatedAddress,
        setUpdatedAddress
    } = useContext(mainContext);

    const navigate = useNavigate()

    const [allDatas, setAllDatas] = useState([])
    const [addressDetailsData, setAddressDetailsData] = useState({})

    const [addressError, setAddressError] = useState("")


    const [spinnerLoader, setSpinnerLoader] = useState(false);


    const [count, setCount] = useState(0);

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('consumerSidebarOpen')
        setLoginUser(null)
        navigate('/login')
    }

    // goToBillPage function
    function goToBillPage() {
        navigate("/consumers/bill");
    }

    // updateAddressDetails function
    async function updateAddressDetails() {
        if (updatedAddress) {
            localStorage.setItem("updatedAddress", JSON.stringify(updatedAddress))
            goToBillPage()
        }
        else {
            // alert("Enter Address")
            setAddressError("Enter Address")
        }
    }

    // getAddress function
    async function getAddress(event) {
        console.log(event.target.checked);

        if (event.target.checked === true) {
            try {
                const token = localStorage.getItem('loginToken');
                var getData = await axios.get(`http://localhost:5000/getAddressDetails/${loginUser._id}`, {
                    headers: {
                        Authorization: token
                    }
                })

                var allData = getData.data.data
                console.log(allData);

                setAddressDetailsData(allData)
                setUpdatedAddress(allData.address)
                setAddressError("")
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
        else if (event.target.checked === false) {
            setAddressDetailsData({})
            setUpdatedAddress("")
            setAddressError("Enter Address")
        }
    }

    function validateAddress(inputValue) {
        if (inputValue) {
            setAddressError("")
        }
        else {
            setAddressError("Enter Address")
        }
        setUpdatedAddress(inputValue);

    }

    function authUser() {
        var user = JSON.parse(localStorage.getItem('loginUser'))
        var token = localStorage.getItem('loginToken')
        console.log(user, "===>");

        if (user && token) {
            setLoginUser(user)
        }
    }

    useEffect(() => {
        try {
            authUser()
        } catch (error) {
            console.log("error");
        }
    }, [])

    return (
        <div className={`flex-1 transition-all duration-300 
            ${sideBarOpen ? "ml-64" : "ml-16"}`}>

            {/* sidebar */}
            <Sidebar />

            {spinnerLoader && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                </div>
            )}

            <div className="flex flex-col flex-1">

                {/* navbar */}
                <Navbar />

                {/* address form */}
                <div className="flex flex-1 items-center justify-center">

                    <div className="w-full max-w-md bg-white shadow-md rounded px-8 py-10 mt-10">

                        <h2 className="text-lg font-bold mb-4 text-center">
                            Address Details
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm text-black font-semibold mb-1">Address</label>
                            <textarea
                                placeholder="Enter address"
                                className="w-full border rounded px-3 py-2"
                                value={updatedAddress}
                                onChange={(event) => { validateAddress(event.target.value) }}
                            ></textarea>
                            <p className="text-sm text-red-500 mb-0">
                                {addressError}
                            </p>
                        </div>

                        <div className="mb-4 flex items-center gap-2">
                            <input type="checkbox" id="sameAddress" onChange={(event) => { getAddress(event) }} />
                            <label htmlFor="sameAddress" className="text-sm text-black">
                                Same as current address
                            </label>
                        </div>

                        <button className="w-full bg-gray-500 text-white py-2 rounded mb-3" onClick={() => {
                            updateAddressDetails()
                        }}>
                            update address
                        </button>
                    </div>

                </div>

                {/* footer */}
                <Footer />

            </div>
        </div>
    )
}

