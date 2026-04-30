import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import banner1 from '../../assets/banner1.jpg'
import banner2 from '../../assets/banner2.jpg'
import banner3 from '../../assets/banner3.jpg'
import axios from 'axios';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';

export const UserDashboard = () => {

  const {
    sideBarOpen,
    setSideBarOpen,
    loginUser,
    setLoginUser,
    cartCount,
    setCartCount
  } = useContext(mainContext);

  const navigate = useNavigate()

  const [fewDatas, setFewDatas] = useState([])
  const [cartDatas, setcartDatas] = useState([])

  const [spinnerLoader, setSpinnerLoader] = useState(false);

  const [particularProduct, setParticularProduct] = useState({})

  const [randomNumber, setRandomNumber] = useState(0)

  const defaultSlides = [
    { image: banner1 },
    { image: banner2 },
    { image: banner3 }
  ]
  const [slide, setSlide] = useState(0)

  const [viewModalOpen, setViewModalOpen] = useState(false);

  // ratings function
  function ratings(loopValue) {
    var ratingsArray = []
    for (let index = 0; index < loopValue; index++) {
      var fontAwesomeStars = <i className="fa-solid fa-star text-yellow-600" key={index}></i>
      ratingsArray.push(fontAwesomeStars)
    }

    return ratingsArray;
  }

  // openViewModal function
  async function openViewModal(id) {
    setSpinnerLoader(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await getOneProduct(id)
      setViewModalOpen(true)
    } catch (error) {
      console.log(error);
    } finally {
      setSpinnerLoader(false);
    }
  }

  // closeViewModal function
  function closeViewModal() {
    setViewModalOpen(false)
  }

  // logout function
  function logOut() {
    localStorage.removeItem('loginToken')
    localStorage.removeItem('loginUser')
    localStorage.removeItem('consumerSidebarOpen')
    setLoginUser(null)
    navigate('/login')
  }




  async function getOneProduct(id) {
    setSpinnerLoader(true)
    try {
      const getOneData = await axios.get(`http://localhost:5000/getSpecificProduct/${id}`)
      console.log(getOneData.data.data, "==>");
      setParticularProduct(getOneData.data.data)
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

  // getFewProduct function
  async function getFewProduct() {
    setSpinnerLoader(true)
    try {
      var getData = await axios.get(`http://localhost:5000/getFewData`)
      console.log(getData.data.data);

      setFewDatas(getData.data.data)
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

  // addToCart function
  async function addToCart(id) {
    setSpinnerLoader(true)
    if (loginUser) {
      var datas = {}
      var userId = loginUser._id
      var productId = id
      datas.userId = userId
      datas.productId = productId

      try {
        const token = localStorage.getItem('loginToken');

        var getData = await axios.post("http://localhost:5000/cartAdd", { data: datas },
          {
            headers: {
              Authorization: token
            }
          }
        )

        // alert(getData.data.message);
        getCartData()
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
    else {
      alert("Please login first");
    }
  }

  // getCartData function
  async function getCartData() {
    setSpinnerLoader(true)
    if (loginUser) {
      var datas = {}
      var userId = loginUser._id
      datas.userId = userId

      try {
        const token = localStorage.getItem('loginToken');

        var getData = await axios.post("http://localhost:5000/getCartData", { data: datas },
          {
            headers: {
              Authorization: token
            }
          }
        )
        setcartDatas(getData.data.data)
        setCartCount(getData.data.data.length)
        setSpinnerLoader(false)
        console.log(getData.data.data);

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
    else {
      alert("Please login first");
    }
  }

  // authUser function
  function authUser() {
    var user = JSON.parse(localStorage.getItem('loginUser'))
    var token = localStorage.getItem('loginToken')
    console.log(user, "===>");

    if (user && token) {
      setLoginUser(user)
    }
    getFewProduct()
  }

  function generate() {
    const randomNumberGenerate = Math.floor(Math.random() * 3);
    console.log(randomNumberGenerate, "===>");
    setRandomNumber(randomNumberGenerate);
    setTimeout(() => {
      generate()
    }, 2000);
  }

  useEffect(() => {
    if (loginUser?._id) {
      getCartData()
      generate()
    }
  }, [loginUser])

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

        {/* navbar section */}
        <Navbar />

        <div className="w-full relative">

          {/* Slides */}
          <div className="flex overflow-hidden">

            <img className="w-full flex-shrink-0 bg-indigo-100 h-80 flex items-center justify-center rounded-xl" src={defaultSlides[randomNumber].image} />

          </div>

          <button
            className={`absolute left-2 top-1/2 bg-white p-2 rounded-full shadow ${randomNumber === 0 ? "hidden" : ""}`}
            onClick={() => generate()}
            disabled={randomNumber === 0}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <button
            className={`absolute right-2 top-1/2 bg-white p-2 rounded-full shadow ${randomNumber === defaultSlides.length - 1 ? "hidden" : ""}`}
            onClick={() => generate()}
            disabled={randomNumber === defaultSlides.length - 1}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>

        </div>

        {/* Product Grid */}
        <div className="bg-white p-10">
          <div className='relative grid grid-cols-2'>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Product Card */}

            {fewDatas.map((data, index) => {
              return (
                <div>
                  <img
                    src={`http://localhost:5000/uploadingImages/${data.image}`}
                    className="w-full h-60 object-contain bg-gray-100 rounded-md"
                  />

                  <div className="mt-3 flex justify-between">
                    <div>
                      <h3 className="text-sm font-bold hover:underline cursor-pointer" onClick={() => {
                        openViewModal(data._id)
                      }}>{data.name}</h3>
                      <p className="text-sm text-gray-500 font-bold mb-2">{data.color}</p>
                      <div className='flex'>
                        {ratings(data.rating)}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-blue-600"> <i class="fa-solid fa-dollar-sign"></i> {data.price}</p>
                  </div>
                </div>
              )
            })}


          </div>
        </div>

        <div className="flex justify-center mb-6">
          <a href="/consumers/products" className="w-60 flex justify-center items-center bg-blue-500 px-4 py-4 text-center font-bold text-white rounded">
            see more <i className="fa-solid fa-arrow-right-long ml-2"></i>
          </a>
        </div>


        {/* view modal */}

        {viewModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white w-[90%] md:w-[600px] p-6 rounded-lg relative">

              <button
                onClick={() => closeViewModal()}
                className="absolute top-3 right-3 text-gray-500"
              >
                <i className="fa-solid fa-x"></i>
              </button>

              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={`http://localhost:5000/uploadingImages/${particularProduct.image}`}
                  className="w-full md:w-1/2 rounded"
                />
                <div className="flex-1">

                  <h2 className="text-xl font-bold">
                    {particularProduct.name}
                  </h2>

                  <p className="text-lg font-semibold mt-2">
                    <i class="fa-solid fa-dollar-sign"></i> {particularProduct.price} <span className='line-through text-gray-500'>{particularProduct.defaultPrice}</span>
                  </p>

                  <div className="mt-4">
                    <p className="font-bold text-black text-xl">Description : <span className='text-gray-500'>{particularProduct.description} </span></p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold text-black text-xl">Offer : <span className='text-blue-500'>{particularProduct.offer} <i className="fa-solid fa-percent"></i></span></p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold text-black text-xl">Color : <span className='text-blue-500'>{particularProduct.color}</span></p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold text-black text-xl">Size : <span className='text-gray-500'>{particularProduct.size}</span></p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold text-black text-xl">Category : <span className='text-green-600'>{particularProduct.category}</span></p>
                  </div>

                  <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded" onClick={() => {
                    addToCart(particularProduct._id)
                  }}>
                    {cartDatas.includes(particularProduct._id) ? "Remove from cart" : "Add to Cart"}
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* footer section */}
        <Footer />
      </div>


    </div>
  )
}
