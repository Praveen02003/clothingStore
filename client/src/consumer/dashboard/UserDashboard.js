import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const UserDashboard = () => {
  const [open, setOpen] = useState(false);

  const [auth, setAuth] = useState(false);

  const [loginUser, setLoginUser] = useState({});

  const navigate = useNavigate();

  // goToLoginPage function
  function goToLoginPage() {
    navigate('/login')
  }

  // goToSignupPage function
  function goToSignupPage() {
    navigate('/signup')
  }

  // logout function
  function logOut() {
    localStorage.removeItem('loginToken')
    localStorage.removeItem('loginUser')
    navigate('/login')
  }

  // goToSignupPage function
  function getAuth() {
    var user = JSON.parse(localStorage.getItem('loginUser'))
    var token = localStorage.getItem('loginToken')
    console.log(user);

    if (user && token) {
      setAuth(true)
      setLoginUser(user)
    }
    else {
      navigate('/login')
    }
  }

  useEffect(() => {
    getAuth()
  }, [])
  return (

    <div>
      <header className="bg-white shadow">
        <div className="flex justify-between items-center px-4 py-3">

          <h1 className="text-lg font-bold">Cartify</h1>

          <div className="hidden md:flex gap-6">
            <a href="#" className="font-medium">Home</a>
            <a href="#" className="font-medium">Products</a>
            <a href="#" className="font-medium">Cart</a>
            {loginUser.role?.toLowerCase() === "admin" ? <a href="/admin/dashBoard" className="font-bold text-blue-900">Admin</a> : ""}

          </div>

          <div className='flex flex-cols'>

            {!auth && (
              <div>
                <button className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded me-3" onClick={() => {
                  goToLoginPage()
                }}>
                  Login
                </button>
                <button className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded" onClick={() => {
                  goToSignupPage()
                }}>
                  Signup
                </button>
              </div>
            )}
            {auth && (
              <button className="hidden md:block bg-red-600 text-white px-4 py-2 rounded ms-3" onClick={() => {
                logOut()
              }}>
                <i className="fa-solid fa-right-from-bracket"></i> Log Out
              </button>
            )}
          </div>


          <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
            <i className="fa-solid fa-bars"></i>
          </button>

        </div>

        {open && (
          <div className="md:hidden flex flex-col gap-4 px-4 pb-4">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">Cart</a>
            {loginUser.role.toLowerCase() === "admin" ? <a href="#">Admin</a> : ""}


            {!auth && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => {
                goToLoginPage()
              }}>
                Login
              </button>
            )}
            {!auth && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => {
                goToSignupPage()
              }}>
                Signup
              </button>
            )}
            {auth && (
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => {
                logOut()
              }}>
                <i className="fa-solid fa-right-from-bracket"></i> Log Out
              </button>
            )}
          </div>
        )}
      </header>

      
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Products</h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <div className="group relative">
              <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg" alt="Front of men&#039;s Basic Tee in black." className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      Basic Tee
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Black</p>
                </div>
                <p className="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
            <div className="group relative">
              <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg" alt="Front of men&#039;s Basic Tee in white." className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      Basic Tee
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Aspen White</p>
                </div>
                <p className="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
            <div className="group relative">
              <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg" alt="Front of men&#039;s Basic Tee in dark gray." className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      Basic Tee
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Charcoal</p>
                </div>
                <p className="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
            <div className="group relative">
              <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg" alt="Front of men&#039;s Artwork Tee in peach with white and brown dots forming an isometric cube." className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      Artwork Tee
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Iso Dots</p>
                </div>
                <p className="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>




  )
}
