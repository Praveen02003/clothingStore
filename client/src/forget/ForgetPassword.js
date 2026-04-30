import React, { useContext, useEffect, useState } from 'react'
import '../forget/ForgetPassword.css'
import { data, useNavigate } from 'react-router-dom'
import axios from 'axios';


export const ForgetPassword = () => {

    var navigate = useNavigate();

    const [count, setCount] = useState(1)
    const [presentedData, setPresentedData] = useState({})

    const [spinnerLoader, setSpinnerLoader] = useState(false);

    const [openAlert, setOpenAlert] = useState(false)
    const [alertColor, setAlertColor] = useState(null)
    const [alertContent, setAlertContent] = useState(null)

    var allErrors = {
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
        securityAnswerTypeError: ""
    };

    var [formData, setFormData] = useState({
        email: JSON.parse(localStorage.getItem("resetEmail")) || "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: "",
        securityAnswerType: ""
    });

    var [error, setError] = useState({
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
        securityAnswerTypeError: ""
    });

    var [boolean, setBoolean] = useState(false);

    // validateEmail function
    function validateEmail(value) {
        var allErrors = { ...error }
        var inputValue = value;

        setFormData({ ...formData, email: inputValue })

        if (!inputValue) {
            allErrors.emailError = 'Enter Email';
        }
        else {
            allErrors.emailError = "";
        }
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

    // validateSecurityQuestion function
    function validateSecurityAnswerType(value) {
        var allErrors = { ...error }
        var inputValue = value;

        setFormData({ ...formData, securityAnswerType: inputValue })

        if (!inputValue) {
            allErrors.securityAnswerTypeError = 'Enter Answer';
        }
        else {
            allErrors.securityAnswerTypeError = "";
        }
        setError(allErrors)
    }

    // submitForm function

    async function submitForm(event) {
        setSpinnerLoader(true)
        event.preventDefault();
        try {
            if (count === 1) {
                if (!formData.email) {
                    setSpinnerLoader(false)
                    setError({ ...error, emailError: "Enter Email" });
                    return;
                }

                const res = await axios.post("http://localhost:5000/forgetPassword", {
                    data: formData
                });

                if (res.data.message === "Data present") {
                    setCount(2);
                    console.log(res.data.data, "===>");
                    var question = res.data.data.securityQuestion
                    var answer = res.data.data.securityAnswer
                    console.log(question);
                    console.log(answer);

                    setFormData({ ...formData, securityQuestion: question, securityAnswer: answer })

                } else {
                    console.log(res.data.message);
                    setAlertContent(res.data.message)
                    setOpenAlert(true)
                    setTimeout(() => {
                        setOpenAlert(false)
                    }, 1000);
                }
                setSpinnerLoader(false)
            }

            else if (count === 2) {
                if (!formData.securityAnswerType) {
                    setSpinnerLoader(false)
                    setError({ ...error, securityAnswerTypeError: "Enter Answer" });
                    return;
                }

                const res = await axios.post("http://localhost:5000/forgetPassword", {
                    data: formData
                });

                if (res.data.message === "Validate success") {
                    setCount(3);
                } else {
                    setAlertContent(res.data.message)
                    setOpenAlert(true)
                    setTimeout(() => {
                        setOpenAlert(false)
                    }, 1000);
                }
                setSpinnerLoader(false)
            }

            else if (count === 3) {

                let allErrors = { ...error };

                if (!formData.password) {
                    allErrors.passwordError = "Enter Password";
                }
                else if (formData.password.length < 8) {
                    allErrors.passwordError = "Password must be at least 8 characters";
                }
                else if (!/\d/.test(formData.password)) {

                    allErrors.passwordError = "Password must contain at least one number";
                }
                else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {

                    allErrors.passwordError = "Password must contain at least one special character";
                }
                else {

                    allErrors.passwordError = "";
                }

                if (!formData.confirmPassword) {
                    allErrors.confirmPasswordError = "Enter Confirm-Password";
                }
                else if (formData.password !== formData.confirmPassword) {
                    allErrors.confirmPasswordError = "Passwords do not match";
                }
                else {
                    allErrors.confirmPasswordError = "";
                }

                setError(allErrors);

                if (allErrors.passwordError || allErrors.confirmPasswordError) {
                    setSpinnerLoader(false)
                    return;
                }

                const res = await axios.post("http://localhost:5000/forgetPassword", {
                    data: formData,
                });


                if (res.data.message === "Password reset success") {
                    setAlertContent(res.data.message)
                    setOpenAlert(true)
                    localStorage.removeItem("resetEmail")
                    setTimeout(() => {
                        setOpenAlert(false)
                        setSpinnerLoader(false)
                        navigate("/login");
                    }, 1000);
                }
                else {
                    setSpinnerLoader(false)
                    setAlertContent(res.data.message)
                    setOpenAlert(true)
                    setTimeout(() => {
                        setOpenAlert(false)
                    }, 1000);
                }
            }

        } catch (err) {
            console.log(err);
        }
    }

    function authUser() {
        var user = JSON.parse(localStorage.getItem('loginUser'))
        var token = localStorage.getItem('loginToken')
        console.log(user, "===>");

        if (user && token) {
            if (user.role.toLowerCase() === "admin") {
                navigate('/admin/dashBoard');
            }
            else {
                navigate("/");
            }
        }
    }

    useEffect(() => {
        authUser();
    }, [])
    return (
        <div id='mainForm'>
            {spinnerLoader && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                </div>
            )}

            <div className="resetForm">

                <h2 className='font-bold text-2xl'>Reset Password</h2>
                {openAlert && (
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span class="block sm:inline">{alertContent}</span>
                    </div>
                )}


                {/* reset form */}
                <form id="resetForm" onSubmit={(event) => {
                    submitForm(event)
                }}>

                    {/* email */}

                    {count === 1 && (
                        <input type="email" placeholder="Enter Email" id="email" value={formData.email} onInput={(event) => { validateEmail(event.target.value) }} />
                    )}
                    {count === 1 && (
                        <p id="emailError">{error.emailError}</p>
                    )}

                    {/* security question */}
                    {count === 2 && (
                        <div className='grid grid-col-2'>
                            <label className='font-bold' for="securityQuestion">{formData.securityQuestion}</label>
                            <input type="text" placeholder="Enter Second Name" id="securityQuestion" value={formData.securityQuestionType} onInput={(event) => { validateSecurityAnswerType(event.target.value) }} />
                            <p id="securityAnswerTypeError">{error.securityAnswerTypeError}</p>
                        </div>
                    )}

                    {/* password */}

                    {count === 3 && (
                        <input type="password" placeholder="Password" id="password" value={formData.password} onInput={(event) => { validatePassword(event.target.value) }} />
                    )}
                    {count === 3 && (
                        <p id="passwordError">{error.passwordError}</p>
                    )}

                    {/* confirm-password */}

                    {count === 3 && (
                        <input type="password" placeholder="Confirm Password" id="confirmPassword" value={formData.confirmPassword} onInput={(event) => { validateConfirmPassword(event.target.value) }} />
                    )}
                    {count === 3 && (
                        <p id="confirmPasswordError">{error.confirmPasswordError}</p>
                    )}

                    {/* submit button */}
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={spinnerLoader}
                    >
                        {spinnerLoader ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            <div>
                                Next
                            </div>
                        )}
                    </button>

                </form>

                {/* link */}
                <div className="link">
                    Go to Login?
                    <a href='/login'>
                        Login
                    </a>
                </div>

            </div>
        </div>
    )
}
