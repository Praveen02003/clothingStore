import React, { useContext, useEffect, useRef, useState } from 'react'
import '../login/Login.css'
import { useNavigate } from 'react-router-dom'
import api from '../axios/AxiosFile';
import ReCAPTCHA from "react-google-recaptcha";
import { SiteKey } from '../backendUrl/Sitekey';


export const Login = () => {

  var navigate = useNavigate();

  const captchaReference = useRef(null);

  const [openAlert, setOpenAlert] = useState(false)
  const [alertColor, setAlertColor] = useState(null)
  const [alertContent, setAlertContent] = useState(null)
  const [alertBgColor, setAlertBgColor] = useState(null)

  const [toggleValue, setToggleValue] = useState("password")

  const [spinnerLoader, setSpinnerLoader] = useState(false);

  var [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: ""
  });

  var [error, setError] = useState({
    emailError: "",
    passwordError: "",
    captchaError: ""
  });

  var [boolean, setBoolean] = useState(false);

  // saveEmail function
  function saveEmail() {
    localStorage.setItem("resetEmail", JSON.stringify(formData.email))
    navigate("/consumer/resetPassword")
  }
  // showPassword function
  function showPassword() {
    if (toggleValue === "password") {
      setToggleValue("text")
    }
    else if (toggleValue === "text") {
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

    if (!formData.captcha) {
      allErrors.captchaError = "Enter Captcha";
    }

    setError(allErrors);

    if (formData.email && formData.password && formData.captcha) {
      console.log(formData);
      try {
        setSpinnerLoader(true)
        var result = await api.post("/api/consumers/loginUser", { data: formData });
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
          setAlertBgColor('red')
          setAlertContent(result.data.message)
          setOpenAlert(true)
          setTimeout(() => {
            setOpenAlert(false)
          }, 2000);
        }
      } catch (error) {
        setSpinnerLoader(false)
        setAlertBgColor('red')
        setAlertContent("please try again later")
        setOpenAlert(true)
        setTimeout(() => {
          setOpenAlert(false)
        }, 2000);

      }

      captchaReference.current.reset();
    }
  }

  // captchaChange function
  function captchChange(event) {

    var allErrors = { ...error }
    var token = event;

    setFormData({ ...formData, captcha: token })

    if (!token) {
      allErrors.captchaError = 'Enter Captcha';
    }
    else {
      allErrors.captchaError = "";
    }
    setError(allErrors)
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

        {/* login form */}
        <form id="loginForm" onSubmit={(event) => {
          submitForm(event)
        }}>

          {/* email */}
          <input type="email" placeholder="Enter Email" id="email" value={formData.email} onInput={(event) => { validateEmail(event.target.value) }} />
          <p id="emailError">{error.emailError}</p>

          {/* password */}
          <div className="relative w-full">

            <input
              type={toggleValue}
              placeholder="Enter Password"
              value={formData.password}
              onInput={(event) => validatePassword(event.target.value)}
              className="w-full border p-2 pr-10"
            />

            <button
              type="button"
              className="absolute sm:top-2 md:top-2 right-5"
              onClick={() => {
                showPassword()
              }}
            >
              {toggleValue === "password" ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}

            </button>

          </div>

          <p>{error.passwordError}</p>



          <div className="overflow-hidden">
            <div className="transform scale-75 origin-left sm:scale-100">
              <ReCAPTCHA
                ref={captchaReference}
                sitekey={SiteKey}
                onChange={(event) => {
                  captchChange(event)
                }}
              />
            </div>
          </div>

          <p>{error.captchaError}</p>

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
                <i className="fa-solid fa-right-to-bracket"></i> Login

              </div>
            )}
          </button>

        </form>

        {/* link */}
        <div className="link">
          <button className='text-blue-700 hover:underline' onClick={() => {
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

      {/* alert */}
      {openAlert && (
        <div className={`fixed bottom-5 flex items-center p-4 bg-${alertBgColor}-600 rounded-lg shadow-lg text-white`} role="alert">
          <div className="text-sm font-normal">{alertContent}</div>
        </div>
      )}
    </div>
  )
}
