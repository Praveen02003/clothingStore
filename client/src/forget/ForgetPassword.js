import React, { useEffect, useState } from 'react'
import '../forget/ForgetPassword.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export const ForgetPassword = () => {
    var navigate = useNavigate();

    const [openAlert, setOpenAlert] = useState(false)
    const [alertColor, setAlertColor] = useState(null)
    const [alertContent, setAlertContent] = useState(null)

    var allErrors = {
        emailError: "",
        passwordError: ""
    };

    var [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    var [error, setError] = useState({
        emailError: "",
        passwordError: ""
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

    // submitForm function

    async function submitForm(event) {
        event.preventDefault();

        var allErrors = { ...error }

        if (!formData.email) {
            allErrors.emailError = "Enter Email";
        }

        if (!formData.password) {
            allErrors.passwordError = "Enter Password";
        }

        setError(allErrors);

        if (formData.email && formData.password) {
            console.log(formData);
            try {
                var result = await axios.post("http://localhost:5000/loginUser", { data: formData });
                console.log(result.data.message);
                // alert(result.data.message);

                if (result.data.message === "Login Successfully") {

                    setAlertColor('green')
                    setAlertContent(result.data.message)
                    setOpenAlert(true)


                    var loginUser = result.data.data
                    var loginToken = result.data.token
                    localStorage.setItem('loginUser', JSON.stringify(loginUser))
                    localStorage.setItem('loginToken', loginToken)
                    console.log(loginUser);

                    setTimeout(() => {
                        setOpenAlert(false)
                        if (loginUser.role.toLowerCase() === "admin") {
                            navigate('/admin/dashBoard');
                        }
                        else {
                            navigate("/");
                        }
                    }, 1500);

                }
                else {
                    setAlertColor('red')
                    setAlertContent(result.data.message)
                    setOpenAlert(true)
                    setTimeout(() => {
                        setOpenAlert(false)
                    }, 1000);
                }
            } catch (error) {
                alert(error);
            }
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

                {/* heading */}
                <h2 className='font-bold text-2xl'>Reset Password</h2>

                {/* reset form */}
                <form id="resetForm" onSubmit={(event) => {
                    submitForm(event)
                }}>

                    {/* email */}
                    <input type="email" placeholder="Enter Email" id="email" value={formData.email} onInput={(event) => { validateEmail(event.target.value) }} />
                    <p id="emailError">{error.emailError}</p>

                    {/* password */}
                    <input type="password" placeholder="Password" id="password" value={formData.password} onInput={(event) => { validatePassword(event.target.value) }} />
                    <p id="passwordError">{error.passwordError}</p>

                    {/* confirm-password */}
                    <input type="password" placeholder="Confirm Password" id="confirmPassword" value={formData.confirmPassword} onInput={(event) => { validateConfirmPassword(event.target.value) }} />
                    <p id="confirmPasswordError">{error.confirmPasswordError}</p>

                    {/* second name */}
                    <input type="text" placeholder="Enter your second name" id="secondName" value={formData.confirmPassword} onInput={(event) => { validateConfirmPassword(event.target.value) }} />

                    {/* submit button */}
                    <button type="submit">
                        <i class="fa-solid fa-cloud-arrow-up"></i> Reset
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

            {openAlert && (
                <div className={`fixed top-4 right-4 flex items-center bg-${alertColor}-700 text-white text-sm font-bold px-4 py-4 rounded`} role="alert">
                    <p className='text-white text-sm'>{alertContent}</p>
                </div>
            )}
        </div>
    )
}
