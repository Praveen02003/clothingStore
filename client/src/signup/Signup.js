import React, { useEffect, useState } from 'react'
import '../signup/Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

export const Signup = () => {

    const [openAlert, setOpenAlert] = useState(false)
    const [alertColor, setAlertColor] = useState(null)
    const [alertContent, setAlertContent] = useState(null)

    const [spinnerLoader, setSpinnerLoader] = useState(false);

    var allErrors = {
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        mobileError: "",
        genderError: "",
        passwordError: "",
        confirmPasswordError: "",
        addressError: "",
        termsError: "",
        securityQuestionError: "",
        securityAnswerError: ""
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
        terms: "",
        securityQuestion: "",
        securityAnswer: ""
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
        termsError: "",
        securityQuestionError: "",
        securityAnswerError: ""

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

    // validateSecurityQuestion
    function validateSecurityQuestion(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.securityQuestionError = 'Select Security Question';
        }
        else {
            allErrors.securityQuestionError = "";
        }

        setFormData({ ...formData, securityQuestion: inputvalue })

        setError(allErrors)
    }

    // validateSecurityAnswer
    function validateSecurityAnswer(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.securityAnswerError = 'Enter Answer';
        }
        else {
            allErrors.securityAnswerError = "";
        }

        setFormData({ ...formData, securityAnswer: inputvalue })

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
        if (!formData.securityQuestion) {
            allErrors.securityQuestionError = 'Select Security Question';
        }
        if (!formData.securityAnswer) {
            allErrors.securityAnswerError = 'Enter answer';
        }

        setError(allErrors);

        const checking = Object.values(allErrors).some(err => err !== "");

        if (!checking) {
            if (formData.password === formData.confirmPassword) {
                var replacedNumber = formData.mobile.replace(/\D/g, "")
                setFormData({ ...formData, mobile: replacedNumber })
                console.log(formData, "===>");
                try {
                    setSpinnerLoader(true)
                    var result = await axios.post("http://localhost:5000/addUsers", { data: formData });
                    console.log(result.data.message);
                    if (result.data.message === "Signup Successfully") {
                        setSpinnerLoader(false)
                        setTimeout(() => {
                            setOpenAlert(false)
                            navigate('/login');
                        }, 1000);
                    }
                    else {
                        setSpinnerLoader(false)
                        setAlertContent(result.data.message)
                        setOpenAlert(true)
                        setTimeout(() => {
                            setOpenAlert(false)
                        }, 2000);
                    }
                } catch (error) {
                    alert(error);
                }
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
        <div className='mainForm'>
            {spinnerLoader && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                </div>
            )}
            <div className="main">

                <h2 className='font-bold text-2xl'>Sign Up</h2>

                {openAlert && (
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span class="block sm:inline">{alertContent}</span>
                    </div>
                )}

                {/* signup form */}
                <form id="signupForm" onSubmit={(event) => {
                    submitForm(event)
                }}>

                    {/* first name */}
                    <input type="text" placeholder="First Name" id="firstName" value={formData.firstName} onInput={(event) => { validateFirstName(event.target.value) }} />
                    <p id="firstNameError">{error.firstNameError}</p>

                    {/* last name */}
                    <input type="text" placeholder="Last Name" id="lastName" value={formData.lastName} onInput={(event) => { validateLastName(event.target.value) }} />
                    <p id="lastNameError">{error.lastNameError}</p>

                    {/* email */}
                    <input type="email" placeholder="Email" id="email" value={formData.email} onInput={(event) => { validateEmail(event.target.value) }} />
                    <p id="emailError">{error.emailError}</p>

                    {/* mobile */}
                    <div className="inputGroup">
                        <span for="mobile">+1</span>
                        <input type="tel" placeholder="Mobile" id="mobile" value={formData.mobile} onInput={(event) => { validateMobileNumber(event.target.value, event) }} />
                    </div>
                    <p id="mobileError">{error.mobileError}</p>

                    {/* gender */}
                    <select id="gender" value={formData.gender} onInput={(event) => { validateGender(event.target.value) }}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <p id="genderError">{error.genderError}</p>

                    {/* password */}
                    <input type="password" placeholder="Password" id="password" value={formData.password} onInput={(event) => { validatePassword(event.target.value) }} />
                    <p id="passwordError">{error.passwordError}</p>

                    {/* confirm-password */}
                    <input type="password" placeholder="Confirm-Password" id="confirmPassword" value={formData.confirmPassword} onInput={(event) => { validateConfirmPassword(event.target.value) }} />
                    <p id="confirmPasswordError">{error.confirmPasswordError}</p>

                    {/* address */}
                    <textarea placeholder="Enter address" id="address" value={formData.address} onInput={(event) => { validateAddress(event.target.value) }} ></textarea>
                    <p id="addressError">{error.addressError}</p>

                    {/* gender */}
                    <select id="security" value={formData.securityQuestion} onChange={(event) => { validateSecurityQuestion(event.target.value) }}>
                        <option value="">Select Security Question</option>
                        <option value="which mobile brand you like most?">Which Mobile Brand You Like Most?</option>
                        <option value="which car brand you like most?">Which Car Brand You Like Most?</option>
                        <option value="how many mobiles you have?">How Many Mobiles You Have?</option>
                    </select>
                    <p id="genderError">{error.securityQuestionError}</p>

                    {formData.securityQuestion && (
                        < textarea placeholder="Enter answer" id="answer" value={formData.securityAnswer} onInput={(event) => { validateSecurityAnswer(event.target.value) }} ></textarea>
                    )}
                    {formData.securityQuestion && (
                        <p id="securityQuestionError">{error.securityAnswerError}</p>
                    )}

                    {/* terms */}
                    <div className="termsRow">
                        <input type="checkbox" id="terms" checked={formData.terms} onChange={(event) => { validateTerms(event.target.checked) }} />
                        <label for="terms">Terms & Conditions</label>
                    </div>
                    <p id="termsError">{error.termsError}</p>

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
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                Register
                            </div>
                        )}
                    </button>

                </form>

                {/* link */}
                <div className="link">
                    Already have an account?
                    <Link to='/login'>Login</Link>
                </div>

            </div>
        </div >
    )
}
