import React, { useEffect, useState } from 'react'
import '../login/Login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

export const Login = () => {
  var navigate = useNavigate();

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
        var result = await axios.post("http://localhost:5000/loginUser", { data: formData });
        console.log(result.data.message);
        alert(result.data.message);
        if (result.data.message === "Login Successfully") {
          localStorage.setItem('loginUser', result.data.data)
          setTimeout(() => {
            navigate('/admin/dashBoard');
          }, 1000);
        }
      } catch (error) {
        alert(error);
      }
    }
  }


  function authUser() {
    var getData = localStorage.getItem('loginUser')
    if (getData) {
      navigate('/customers/products');
    }
  }

  useEffect(() => {
    authUser();
  }, [])
  return (
    <div id='mainForm'>
      <div className="loginForm">

        {/* heading */}
        <h2 className='font-bold text-2xl'>Login</h2>

        {/* login form */}
        <form id="loginForm" onSubmit={(event) => {
          submitForm(event)
        }}>

          {/* email */}
          <input type="email" placeholder="Enter Email" id="email" value={formData.email} onInput={(event) => { validateEmail(event.target.value) }} />
          <p id="emailError">{error.emailError}</p>

          {/* password */}
          <input type="password" placeholder="Enter Password" id="password" value={formData.password} onInput={(event) => { validatePassword(event.target.value) }} />
          <p id="passwordError">{error.passwordError}</p>

          {/* submit button */}
          <button type="submit">
            <i className="fa-solid fa-right-to-bracket"></i> Login
          </button>

        </form>

        {/* link */}
        <div className="link">
          Don't have an account?
          <Link to='/signup'>
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  )
}
