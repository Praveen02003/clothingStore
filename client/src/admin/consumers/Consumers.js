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

    const navigate = useNavigate();

    // edit consumer
    var [editFormData, setEditFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        image: "",
        mobile: "",
        gender: "",
        password: "",
        confirmPassword: "",
        address: "",
        terms: "",
        securityQuestion: "",
        securityAnswer: ""
    });

    var [editError, setEditError] = useState({
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        imageError: "",
        mobileError: "",
        genderError: "",
        passwordError: "",
        confirmPasswordError: "",
        addressError: "",
        termsError: "",
        securityQuestionError: "",
        securityAnswerError: ""
    });


    // editValidateFirstName function
    function editValidateFirstName(value) {

        var allErrors = { ...editError }
        var inputValue = value;

        setGetParticularConsumer({ ...getParticularConsumer, firstName: inputValue })

        if (!inputValue) {
            allErrors.firstNameError = 'Enter First Name';
        }
        else {
            allErrors.firstNameError = "";
        }
        setEditError(allErrors)
    }


    // editValidateLastName function
    function editValidateLastName(value) {

        var allErrors = { ...error }
        var inputValue = value;

        setGetParticularConsumer({ ...getParticularConsumer, lastName: inputValue })

        if (!inputValue) {
            allErrors.lastNameError = 'Enter Last Name';
        }
        else {
            allErrors.lastNameError = "";
        }
        setEditError(allErrors)
    }


    // editValidateEmail function
    function editValidateEmail(value) {
        let allErrors = { ...error };
        let inputValue = value;

        setGetParticularConsumer({ ...getParticularConsumer, email: inputValue })

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

        setEditError(allErrors);
    }

    // editValidateMobileNumber function
    function editValidateMobileNumber(inputvalue, event) {

        let allErrors = { ...error };


        var finalnumber = "";
        var formattednumber = "";

        if (!inputvalue) {
            allErrors.mobileError = "Enter Mobile Number";
            setEditError(allErrors)
            setGetParticularConsumer({ ...getParticularConsumer, mobile: formattednumber })
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

        setGetParticularConsumer({ ...getParticularConsumer, mobile: formattednumber })

        setEditError(allErrors)
    }

    // editValidateGender function
    function editValidateGender(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.genderError = "Select Gender";
        }
        else {
            allErrors.genderError = "";
        }

        setGetParticularConsumer({ ...getParticularConsumer, gender: inputvalue })

        setEditError(allErrors)
    }

    // editValidateTerms
    function editValidateTerms(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.termsError = "Accept terms and condition";
        }
        else {
            allErrors.termsError = "";
        }

        setGetParticularConsumer({ ...getParticularConsumer, terms: inputvalue })

        setEditError(allErrors)
    }


    // editValidatePassword function
    function editValidatePassword(inputvalue) {
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
        setGetParticularConsumer({ ...getParticularConsumer, newPassword: inputvalue })

        setEditError(allErrors)
    }

    // editValidateConfirmPassword
    function editValidateConfirmPassword(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.confirmPasswordError = 'Enter Confirm-Password';
        }
        else if (getParticularConsumer.newPassword !== inputvalue) {
            allErrors.confirmPasswordError = "Password do not match";
        }
        else {
            allErrors.confirmPasswordError = "";
        }

        setGetParticularConsumer({ ...getParticularConsumer, confirmPassword: inputvalue })

        setEditError(allErrors)
    }

    // editValidateAddress
    function editValidateAddress(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.addressError = 'Enter address';
        }
        else {
            allErrors.addressError = "";
        }

        setGetParticularConsumer({ ...getParticularConsumer, address: inputvalue })

        setEditError(allErrors)
    }

    // validateImage function
    function editValidateImage(event) {
        console.log(event, "===>");

        if (event.target.files && event.target.files[0]) {
            setEditError({ ...editError, imageError: "" })
        }
        else {
            setEditError({ ...editError, imageError: "Choose Image" })

        }
        setGetParticularConsumer({ ...getParticularConsumer, images: event.target.files[0] })
    }

    // editValidateSecurityQuestion
    function editValidateSecurityQuestion(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.securityQuestionError = 'Select Security Question';
        }
        else {
            allErrors.securityQuestionError = "";
        }
        setGetParticularConsumer({ ...getParticularConsumer, securityQuestion: inputvalue })

        setEditError(allErrors)
    }

    // editValidateSecurityAnswer
    function editValidateSecurityAnswer(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.securityAnswerError = 'Enter Answer';
        }
        else {
            allErrors.securityAnswerError = "";
        }
        setGetParticularConsumer({ ...getParticularConsumer, securityAnswer: inputvalue })

        setEditError(allErrors)
    }

    //  updateUser function 
    async function updateUser(event) {
        event.preventDefault();

        let allErrors = { ...editError };

        const data = getParticularConsumer;


        if (!data.firstName) {
            allErrors.firstNameError = "Enter FirstName";
        }


        if (!data.lastName) {
            allErrors.lastNameError = "Enter LastName";
        }

        if (!data.email) {
            allErrors.emailError = "Enter email";
        }

        if (!data.images) {
            allErrors.imageError = "Choose Image";
        }


        if (!data.mobile) {
            allErrors.mobileError = "Enter MobileNumber";
        }



        if (!data.gender) {
            allErrors.genderError = "Select gender";
        }

        if (!data.securityQuestion) {
            allErrors.securityQuestionError = "Select Security Question";
        }
        if (!data.securityAnswer) {
            allErrors.securityAnswerError = "Enter answer";
        }


        if (!data.address) {
            allErrors.addressError = "Enter address";
        }

        if (!data.terms) {
            allErrors.termsError = "Accept terms";
        }

        const passwordBoolean = (data.newPassword && (data.newPassword.length > 0));
        const confirmPasswordBoolean = (data.confirmPassword && (data.confirmPassword.length > 0));

        if (passwordBoolean || confirmPasswordBoolean) {

            if (!passwordBoolean) {
                allErrors.passwordError = "Enter Password";
            } else {
                allErrors.passwordError = "";
            }

            if (!confirmPasswordBoolean) {
                allErrors.confirmPasswordError = "Enter Confirm-Password";
            } else {
                allErrors.confirmPasswordError = "";
            }

            if (passwordBoolean && confirmPasswordBoolean && data.newPassword !== data.confirmPassword) {
                allErrors.confirmPasswordError = "Password do not match";
            }
        }

        setEditError(allErrors);

        const hasError = Object.values(allErrors).some(data => data !== "");

        if (hasError) {
            return;
        }
        console.log(getParticularConsumer);

        try {
            const formData = new FormData();

            formData.append("firstName", getParticularConsumer.firstName);
            formData.append("lastName", getParticularConsumer.lastName);
            formData.append("email", getParticularConsumer.email);
            formData.append("mobile", getParticularConsumer.mobile);
            formData.append("gender", getParticularConsumer.gender);
            formData.append("address", getParticularConsumer.address);
            formData.append("terms", getParticularConsumer.terms);
            formData.append("securityQuestion", getParticularConsumer.securityQuestion);
            formData.append("securityAnswer", getParticularConsumer.securityAnswer);

            if (getParticularConsumer.newPassword && getParticularConsumer.confirmPassword) {
                formData.append("newPassword", getParticularConsumer.newPassword);
                formData.append("confirmPassword", getParticularConsumer.confirmPassword);
            }

            if (getParticularConsumer.images) {
                formData.append("image", getParticularConsumer.images);
            }
            const token = localStorage.getItem('loginToken');
            const updateData = await axios.post(
                "http://localhost:5000/updateUser",
                formData,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            if (updateData.data.message === "User updated successfully") {

                setAlertContent(updateData.data.message)
                setOpenAlert(true)
                setTimeout(() => {
                    setOpenAlert(false)
                    closeEditModal()
                }, 2000);
            }
            else {
                setAlertContent(updateData.data.message)
                setOpenAlert(true)
                setTimeout(() => {
                    setOpenAlert(false)
                }, 2000);
            }
            getAllConsumers();

            console.log(updateData.data.message);

        } catch (error) {
            console.log(error);
        }
    }

    // add consumer
    var [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        image: "",
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
        imageError: "",
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

    // validateImage function
    function validateImage(event) {
        let allErrors = { ...error };

        if (event.target.files && event.target.files[0]) {
            allErrors.imageError = ""
        }
        else {
            allErrors.imageError = "Choose Image"

        }
        setFormData({ ...formData, image: event.target.files[0] })

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

        if (!formData.securityQuestion) {
            allErrors.securityQuestionError = 'Select Security Question';
        }
        if (!formData.securityAnswer) {
            allErrors.securityAnswerError = 'Enter answer';
        }

        if (!formData.image) {
            allErrors.imageError = "Choose Image";
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
                    var forms = new FormData()
                    forms.append("firstName", formData.firstName);
                    forms.append("lastName", formData.lastName);
                    forms.append("email", formData.email);
                    forms.append("mobile", formData.mobile);
                    forms.append("image", formData.image);
                    forms.append("gender", formData.gender);
                    forms.append("password", formData.password);
                    forms.append("confirmPassword", formData.confirmPassword);
                    forms.append("address", formData.address);
                    forms.append("terms", formData.terms);
                    forms.append("securityAnswer", formData.securityAnswer);
                    forms.append("securityQuestion", formData.securityQuestion);
                    const token = localStorage.getItem('loginToken');
                    var result = await axios.post("http://localhost:5000/addUser", forms, {
                        headers: {
                            Authorization: token,
                            "Content-Type": "multipart/form-data"
                        }
                    }

                    );
                    console.log(result.data.message);
                    if (result.data.message === "User Added Successfully") {
                        getAllConsumers()
                        setAlertContent(result.data.message)
                        setOpenAlert(true)
                        setTimeout(() => {
                            closeAddModal()
                            setOpenAlert(false)
                        }, 2000);
                    }
                    else {
                        console.log(result.data, "====>");

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

    const [consumerModal, setConsumerModal] = useState(false)

    const [editModal, setEditModal] = useState(false)


    const [finalCategory, setFinalCategory] = useState("");
    const [category, setCategory] = useState("");

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

    const [spinnerLoader, setSpinnerLoader] = useState(false);


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

    const convertMobileNumber = (inputValue) => {
        var mobileNumbers = inputValue.replace(/\D/g, "").slice(0, 10);

        if (mobileNumbers.length > 6) {
            return "(" + mobileNumbers.slice(0, 3) + ") " + mobileNumbers.slice(3, 6) + "-" + mobileNumbers.slice(6);
        } else if (mobileNumbers.length > 3) {
            return "(" + mobileNumbers.slice(0, 3) + ") " + mobileNumbers.slice(3);
        }
        return mobileNumbers;
    };


    async function particularConsumer(id) {
        try {
            const token = localStorage.getItem('loginToken');
            const getOneData = await axios.get(`http://localhost:5000/getOneConsumer/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(getOneData.data.data, "==>");
            const data = getOneData.data.data;

            setGetParticularConsumer({
                ...data,
                mobile: convertMobileNumber(data.mobile)
            });

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
            await particularConsumer(id)
            setViewModal(true)
        } catch (error) {
            console.log(error);
        } finally {
            setSpinnerLoader(false);
        }
    }

    function closeViewModal() {
        setViewModal(false)
        setParticularConsumerId({})
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('sidebarOpen')
        navigate('/login')
    }

    async function getAllConsumers() {
        setSpinnerLoader(true)
        try {
            const token = localStorage.getItem('loginToken');
            const getData = await axios.get(`http://localhost:5000/getAllConsumers?page=${currentPage}&count=${dynamicPageNumber}&search=${searchData}&category=${category}`, {
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

    // categoryApply function
    function categoryApply(inputValue) {
        setFinalCategory(inputValue)
    }

    // applyFilter function
    function applyFilter() {
        setCurrentPage(1)
        setSearchData("")
        setCategory(finalCategory)
    }
    // clearFilter function
    function clearFilter() {
        setFinalCategory("");
        setCategory("");
    }

    // search function
    function search(inputValue) {
        setCurrentPage(1)
        setTimeout(() => {
            setSearchData(inputValue)
        }, 1500);
    }

    // edit modal
    async function openEditModal(id) {
        setSpinnerLoader(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await particularConsumer(id)
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

    // edit image removeImage function
    function removeEditImage(product) {
        setGetParticularConsumer({ ...getParticularConsumer, images: "" })
        setEditError({ ...editError, imageError: "Choose Image" })
    }

    // add image removeImage function
    function removeImage() {
        setFormData({ ...formData, image: "" })
        setError({ ...error, imageError: "Choose Image" })
    }


    useEffect(() => {
        try {
            authUser()
        } catch (error) {
            console.log("error");
        }
    }, [currentPage, dynamicPageNumber, searchData, category])

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

                    <h2 className="text-lg font-semibold"> <i className="fa-solid fa-users"></i> Consumers</h2>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* search */}
                        <input
                            type="search"
                            placeholder="Search by name, email"
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
                            <option value="active">Active</option>
                            <option value="inactive">In-Active</option>
                        </select>

                        <button className='bg-blue-500 px-4 py-2 rounded text-white' onClick={() => {
                            applyFilter()
                        }}>
                            Apply
                        </button>
                        {(category) && (
                            <button className='bg-blue-500 px-4 py-2 rounded text-white' onClick={() => {
                                clearFilter()
                            }}>
                                Clear
                            </button>
                        )}

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
                                <tr className='text-center bg-gray-600 text-white'>
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
                                                    <button className="text-blue-600 me-5 font-bold hover:underline" onClick={() => openEditModal(data._id)}>
                                                        <i className="fa-solid fa-marker"></i>
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
                                className="absolute top-4 right-4 text-gray-500"
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Add Consumer</h2>
                            {/* alert */}
                            {openAlert && (
                                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <span class="block sm:inline">{alertContent}</span>
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500 mb-0">
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

                                    <p className="text-sm text-red-500 mb-0">
                                        {error.mobileError}
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
                                        {error.imageError}
                                    </p>
                                    {formData.image && (
                                        <div className="relative inline-block">
                                            <img
                                                src={URL.createObjectURL(formData.image)}
                                                alt="Thumb"
                                                className="w-24 h-24 object-cover rounded-lg border shadow"
                                            />
                                            <button className="absolute top-1 right-1 bg-red-500 text-white text-xs h-6 px-3 py-3 ms-3 rounded flex items-center justify-center shadow hover:bg-red-600" onClick={() => { removeImage() }}>
                                                <i class="fa-solid fa-xmark"></i>
                                            </button>

                                        </div>
                                    )}
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
                                    <p className="text-sm text-red-500 mb-0">
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
                                    <p className="text-sm text-red-500">
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
                                    <p className="text-sm text-red-500 mb-0">
                                        {error.confirmPasswordError}
                                    </p>
                                </div>
                                <div className="block">
                                    <textarea className="w-full border rounded px-3 py-2"
                                        placeholder="Enter address"
                                        id="address"
                                        value={formData.address}
                                        onInput={(event) => { validateAddress(event.target.value) }} ></textarea>
                                    <p className="text-sm text-red-500 mb-0">
                                        {error.addressError}
                                    </p>
                                </div>

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
                                <div className="block">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={formData.terms}
                                        onChange={(event) => { validateTerms(event.target.checked) }}
                                    />
                                    <label for="terms"> Terms & Conditions</label>
                                    <p className="text-sm text-red-500 mb-0">
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

                {/* edit consumer modal */}
                {editModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

                            <button
                                onClick={() => closeEditModal()}
                                className="absolute top-4 right-4 text-gray-500"
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>

                            <h2 className="text-xl font-bold mb-4">Edit Consumer</h2>
                            {/* alert */}
                            {openAlert && (
                                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <span class="block sm:inline">{alertContent}</span>
                                </div>
                            )}

                            <form onSubmit={(event) => {
                                updateUser(event)
                            }}>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="First Name"
                                        id="firstName"
                                        value={getParticularConsumer.firstName}
                                        onInput={(event) => { editValidateFirstName(event.target.value) }}
                                    />
                                    <p className="text-sm text-red-500 mb-0">
                                        {editError.firstNameError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Last Name"
                                        id="lastName"
                                        value={getParticularConsumer.lastName}
                                        onInput={(event) => { editValidateLastName(event.target.value) }}

                                    />
                                    <p className="text-sm text-red-500 mb-0">
                                        {editError.lastNameError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="email"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Email"
                                        id="email"
                                        value={getParticularConsumer.email}
                                        onInput={(event) => { editValidateEmail(event.target.value) }}

                                    />
                                    <p className="text-sm text-red-500 mb-0">
                                        {editError.emailError}
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
                                        {editError.imageError}
                                    </p>
                                    {getParticularConsumer.images && (
                                        <div className="relative inline-block">
                                            <img src={
                                                typeof (getParticularConsumer.images) === "string"
                                                    ? `http://localhost:5000/uploadingImages/${getParticularConsumer.images}`
                                                    : URL.createObjectURL(getParticularConsumer.images)
                                            }
                                                alt="Thumb"
                                                className="w-24 h-24 object-cover rounded-lg border shadow"
                                            />
                                            <button className="absolute top-1 right-1 bg-red-500 text-white text-xs h-6 px-3 py-3 ms-3 rounded flex items-center justify-center shadow hover:bg-red-600" onClick={() => { removeEditImage(getParticularConsumer) }}>
                                                <i class="fa-solid fa-xmark"></i>
                                            </button>

                                        </div>

                                    )}
                                </div>

                                <div className="block">
                                    <div className="flex items-center gap-2">
                                        <span>+1</span>
                                        <input
                                            type="tel"
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="Mobile"
                                            id="mobile"
                                            value={getParticularConsumer.mobile}
                                            onInput={(event) => { editValidateMobileNumber(event.target.value, event) }}
                                        />
                                    </div>

                                    <p className="text-sm text-red-500 mb-0">
                                        {editError.mobileError}
                                    </p>
                                </div>
                                <div className="block sm:w-100">
                                    <select id="gender"
                                        value={getParticularConsumer.gender}
                                        onInput={(event) => { editValidateGender(event.target.value) }}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <p className="text-sm text-red-500 mb-0">
                                        {editError.genderError}
                                    </p>
                                </div>

                                <div className="block">
                                    <input
                                        type="password"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Password"
                                        id="password"
                                        onInput={(event) => { editValidatePassword(event.target.value) }}
                                    />
                                    <p className="text-sm text-red-500">
                                        {editError.passwordError}
                                    </p>
                                </div>
                                <div className="block">
                                    <input
                                        type="password"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Confirm-Password"
                                        id="confirmPassword"
                                        onInput={(event) => { editValidateConfirmPassword(event.target.value) }}
                                    />
                                    <p className="text-sm text-red-500 mb-0">
                                        {editError.confirmPasswordError}
                                    </p>
                                </div>
                                <div className="block">
                                    <textarea className="w-full border rounded px-3 py-2"
                                        placeholder="Enter address"
                                        id="address"
                                        value={getParticularConsumer.address}
                                        onInput={(event) => { editValidateAddress(event.target.value) }} ></textarea>
                                    <p className="text-sm text-red-500 mb-0">
                                        {editError.addressError}
                                    </p>
                                </div>

                                <select id="security" value={getParticularConsumer.securityQuestion} onChange={(event) => { editValidateSecurityQuestion(event.target.value) }}>
                                    <option value="">Select Security Question</option>
                                    <option value="which mobile brand you like most?">Which Mobile Brand You Like Most?</option>
                                    <option value="which car brand you like most?">Which Car Brand You Like Most?</option>
                                    <option value="how many mobiles you have?">How Many Mobiles You Have?</option>
                                </select>
                                <p id="genderError">{editError.securityQuestionError}</p>

                                {getParticularConsumer.securityQuestion && (
                                    < textarea placeholder="Enter answer" id="answer" value={getParticularConsumer.securityAnswer} onInput={(event) => { editValidateSecurityAnswer(event.target.value) }} ></textarea>
                                )}
                                {getParticularConsumer.securityQuestion && (
                                    <p id="securityQuestionError">{editError.securityAnswerError}</p>
                                )}
                                <div className="block">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={getParticularConsumer.terms}
                                        onChange={(event) => { editValidateTerms(event.target.checked) }}
                                    />
                                    <label for="terms"> Terms & Conditions</label>
                                    <p className="text-sm text-red-500 mb-0">
                                        {editError.termsError}
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


                {/* footer section */}
                <AdminFooter />
            </div>
        </div>
    );
};

