import React, { useContext, useEffect, useState } from 'react'
import '../login/Login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';


export const Login = () => {

  var navigate = useNavigate();

  const [openAlert, setOpenAlert] = useState(false)
  const [alertColor, setAlertColor] = useState(null)
  const [alertContent, setAlertContent] = useState(null)


  const [toggleValue, setToggleValue] = useState("password")

  const [spinnerLoader, setSpinnerLoader] = useState(false);

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

  // saveEmail function
  function saveEmail() {
    localStorage.setItem("resetEmail", JSON.stringify(formData.email))
    navigate("/consumer/resetPassword")
  }
  // showPassword function
  function showPassword(inputValue) {
    if (inputValue === true) {
      setToggleValue("text")
    }
    else if (inputValue === false) {
      setToggleValue("password")
    }
  }

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
  function validatePassword(value) {
    var allErrors = { ...error }
    var inputValue = value;

    setFormData({ ...formData, password: inputValue })

    if (!inputValue) {
      allErrors.passwordError = 'Enter Password';
    }
    else {
      allErrors.passwordError = "";
    }
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
        setSpinnerLoader(true)
        var result = await axios.post("http://localhost:5000/loginUser", { data: formData });
        console.log(result.data.message);
        // alert(result.data.message);

        if (result.data.message === "Login Successfully") {
          var loginUser = result.data.data
          var loginToken = result.data.token
          localStorage.setItem('loginUser', JSON.stringify(loginUser))
          localStorage.setItem('loginToken', loginToken)
          console.log(loginUser);

          setTimeout(() => {
            setOpenAlert(false)
            setSpinnerLoader(false)
            if (loginUser.role.toLowerCase() === "admin") {
              navigate('/admin/dashBoard');
            }
            else {
              navigate("/");
            }
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

    <div id='mainForm' >
      {spinnerLoader && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
        </div>
      )}
      <div className="loginForm">

        <h2 className='font-bold text-2xl'>Login</h2>

        {/* alert */}
        {openAlert && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span class="block sm:inline">{alertContent}</span>
          </div>
        )}

        {/* login form */}
        <form id="loginForm" onSubmit={(event) => {
          submitForm(event)
        }}>

          {/* email */}
          <input type="email" placeholder="Enter Email" id="email" value={formData.email} onInput={(event) => { validateEmail(event.target.value) }} />
          <p id="emailError">{error.emailError}</p>

          {/* password */}
          <input type={toggleValue} placeholder="Enter Password" id="password" value={formData.password} onInput={(event) => { validatePassword(event.target.value) }} />
          <p id="passwordError">{error.passwordError}</p>
          <div className="mb-4 flex items-center gap-2">
            <input type="checkbox" id="passwordVisible" onChange={(event) => { showPassword(event.target.checked) }} />
            <label htmlFor="sameAddress" className="text-sm text-black mt-2">
              Show Password
            </label>
          </div>

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
                <i className="fa-solid fa-right-to-bracket"></i>
                Login
              </div>
            )}
          </button>

        </form>

        {/* link */}
        <div className="link">
          <button onClick={() => {
            saveEmail()
          }}>
            Forget Password
          </button>
        </div>
        {/* link */}
        <div className="link">
          Don't have an account?
          <a href='/signup'>
            Sign Up
          </a>
        </div>

      </div>
    </div>
  )
}
