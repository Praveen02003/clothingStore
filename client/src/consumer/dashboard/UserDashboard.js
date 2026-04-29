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
    setLoginUser
  } = useContext(mainContext);

  const navigate = useNavigate()

  const [fewDatas, setFewDatas] = useState([])
  const [cartDatas, setcartDatas] = useState([])

  const [particularProduct, setParticularProduct] = useState({})

  const defaultSlides = [
    { image: banner1 },
    { image: banner2 },
    { image: banner3 }
  ]
  const [slide, setSlide] = useState(0)

  const [viewModalOpen, setViewModalOpen] = useState(false);

  // openViewModal function
  function openViewModal(id) {
    setViewModalOpen(true)
    getOneProduct(id)
  }

  // closeViewModal function
  function closeViewModal() {
    setViewModalOpen(false)
  }



  async function getOneProduct(id) {
    try {

      const getOneData = await axios.get(`http://localhost:5000/getSpecificProduct/${id}`)
      console.log(getOneData.data.data, "==>");
      setParticularProduct(getOneData.data.data)

    } catch (error) {
      console.log("error");
    }
  }

  // getFewProduct function
  async function getFewProduct() {
    try {
      var getData = await axios.get(`http://localhost:5000/getFewData`)
      console.log(getData.data.data);
      setFewDatas(getData.data.data)
    } catch (error) {
      console.log("error");
    }
  }

  // addToCart function
  async function addToCart(id) {
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
      } catch (error) {
        alert(error);

        console.log(error);
      }
    }
    else {
      alert("Please login first");
    }
  }

  // getCartData function
  async function getCartData() {
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
        console.log(getData.data.data);

      } catch (error) {
        alert(error);
        console.log(error);
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

  useEffect(() => {
    if (loginUser?._id) {
      getCartData()
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

      <div className="flex flex-col flex-1">

        {/* navbar section */}
        <Navbar />

        <div className="w-full relative">

          {/* Slides */}
          <div className="flex overflow-hidden">

            <img className="w-full flex-shrink-0 bg-indigo-100 h-80 flex items-center justify-center rounded-xl" src={defaultSlides[slide].image} />

          </div>

          <button
            className={`absolute left-2 top-1/2 bg-white p-2 rounded-full shadow ${slide === 0 ? "hidden" : ""}`}
            onClick={() => setSlide(slide - 1)}
            disabled={slide === 0}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <button
            className={`absolute right-2 top-1/2 bg-white p-2 rounded-full shadow ${slide === defaultSlides.length - 1 ? "hidden" : ""}`}
            onClick={() => setSlide(slide + 1)}
            disabled={slide === defaultSlides.length - 1}
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
                      <p className="text-sm text-gray-500 font-bold">{data.color}</p>
                    </div>
                    <p className="text-sm font-bold text-blue-600"> <i className="fa-solid fa-indian-rupee-sign"></i> {data.price}</p>
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
                    <i className="fa-solid fa-indian-rupee-sign"></i> {particularProduct.price} <span className='line-through text-gray-500'>{particularProduct.defaultPrice}</span>
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
