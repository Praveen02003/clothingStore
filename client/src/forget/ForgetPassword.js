import React, { useEffect, useState } from 'react'
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
        securityQuestionError: ""
    };

    var [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: ""
    });

    var [error, setError] = useState({
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
        securityQuestionError: ""
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

    // validateSecurityQuestion function
    function validateSecurityQuestion(value) {
        var allErrors = { ...error }
        var inputValue = value;

        setFormData({ ...formData, securityQuestion: inputValue })

        if (!inputValue) {
            allErrors.securityQuestionError = 'Enter Second Name';
        }
        else {
            allErrors.securityQuestionError = "";
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

    // submitForm function

    async function submitForm(event) {
        event.preventDefault();
        setSpinnerLoader(true)

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
                if (!formData.securityQuestion) {
                    setSpinnerLoader(false)
                    setError({ ...error, securityQuestionError: "Enter Second Name" });
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
                    setSpinnerLoader(false)
                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);
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
            <div className="resetForm">

                <h2 className='font-bold text-2xl'>Reset Password</h2>
                {openAlert && (
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span class="font-bold block sm:inline">{alertContent}</span>
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
                            <label className='font-bold' for="securityQuestion">What is your second name ?</label>
                            <input type="text" placeholder="Enter Second Name" id="securityQuestion" value={formData.securityQuestion} onInput={(event) => { validateSecurityQuestion(event.target.value) }} />
                            <p id="securityQuestionError">{error.securityQuestionError}</p>
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
