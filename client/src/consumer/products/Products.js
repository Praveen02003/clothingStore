import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import banner1 from '../../assets/banner1.jpg'
import banner2 from '../../assets/banner2.jpg'
import banner3 from '../../assets/banner3.jpg'
import axios from 'axios';
import { Footer } from '../footer/Footer';

export const Products = () => {

  const {
    sideBarOpen,
    setSideBarOpen
  } = useContext(mainContext);

  const navigate = useNavigate()

  const [allDatas, setAllDatas] = useState([])

  const [particularProduct, setParticularProduct] = useState({})

  const [loginUser, setLoginUser] = useState(null)

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [dropDownOpen, setDropDownOpen] = useState(false);

  // openViewModal function
  function openViewModal(id) {
    setViewModalOpen(true)
    getOneProduct(id)
  }

  // closeViewModal function
  function closeViewModal() {
    setViewModalOpen(false)
  }

  // logout function
  function logOut() {
    localStorage.removeItem('loginToken')
    localStorage.removeItem('loginUser')
    setLoginUser(null)
    navigate('/login')
  }

  // goToLoginPage function
  function goToLoginPage() {
    navigate('/login')
  }

  // goToSignupPage function
  function goToSignupPage() {
    navigate('/signup')
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

  async function getAllProducts() {
    try {
      var getData = await axios.get(`http://localhost:5000/getAllProduct`)
      console.log(getData.data.data);
      setAllDatas(getData.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  function authUser() {
    var user = JSON.parse(localStorage.getItem('loginUser'))
    var token = localStorage.getItem('loginToken')
    console.log(user, "===>");

    if (user && token) {
      setLoginUser(user)
    }
    getAllProducts()
  }

  // openDropdown function
  function openDropdown() {
    setDropDownOpen(!dropDownOpen)
  }

  // filterData function
  function filterData(value) {
    var filteredData = allDatas.filter((data, index) => data.category === value)
    console.log(filteredData);
    setAllDatas(filterData)
  }


  // pagination functionality
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPagesArrray = [];
  const totalPages = Math.ceil(allDatas.length / itemsPerPage);
  for (let index = 0; index < totalPages; index++) {
    totalPagesArrray.push(index)
  }
  const lastItem = currentPage * itemsPerPage;
  const firstItem = lastItem - itemsPerPage;

  const currentItems = allDatas.slice(firstItem, lastItem);

  useEffect(() => {
    try {
      authUser()
    } catch (error) {
      console.log("error");

    }
  }, [])

  return (
    <div className="flex h-screen">

      {/* sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">

        <div className="flex items-center justify-between p-6 bg-gray-700 border-b px-4">

          <div className="flex items-center gap-4">

            {/* hamburger button */}
            <button
              onClick={() => setSideBarOpen(true)}
              className="text-xl text-white"
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            <h1 className="text-white font-bold"> <i className="fa-solid fa-truck-fast text-2xl"></i> Cartify</h1>
          </div>

          {/* logout button */}
          <div className="flex items-center gap-2">
            {!loginUser && (
              <div>
                <button className="bg-blue-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                  goToSignupPage()
                }}>
                  <i class="fa-solid fa-user-plus"></i> Signup
                </button>
                <button className="bg-blue-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                  goToLoginPage()
                }}>
                  Login
                </button>
              </div>
            )}
            {loginUser && (
              <div>
                <button className="bg-red-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                  logOut()
                }}>
                  <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="bg-white p-10">

          <div className="flex items-center justify-between mb-6">

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">
              Our Products
            </h2>

            {/* Dropdown */}
            <div className='flex'>
              <div className="relative">
                <button
                  onClick={() => {
                    openDropdown()
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  Sort by category
                </button>

                {/* Dropdown Menu */}
                {dropDownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={(event) => {
                      filterData("men")
                    }}>
                      men
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={(event) => {
                      filterData("women")
                    }}>
                      women
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Product Card */}

            {currentItems.map((data, index) => {
              return (
                <div key={index}>
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
                        <i class="fa-solid fa-star text-yellow-600"></i>
                        <i class="fa-solid fa-star text-yellow-600"></i>
                        <i class="fa-solid fa-star text-yellow-600"></i>
                        <i class="fa-solid fa-star text-yellow-600"></i>
                        <i class="fa-solid fa-star text-yellow-600"></i>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-blue-600"> <i class="fa-solid fa-indian-rupee-sign"></i> {data.price}</p>
                  </div>
                </div>
              )
            })}

          </div>
        </div>

        <div className="flex text-center justify-center h-screen border-t bg-white px-4 py-3">

          <div className="sm:flex sm:flex-1 sm:items-center sm:justify-center">

            {/* pagination */}
            {currentItems.length > 0 && (
              <div className="flex items-center gap-1 mt-4">

                <button
                  className={`px-2 py-1 border rounded ${currentPage === 1 ? "bg-gray-500" : "bg-white"}`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}>
                  Previous
                </button>

                {totalPagesArrray.map((data, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "border"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className={`px-2 py-1 border rounded ${currentPage === totalPages ? "bg-gray-500" : "bg-white"}`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}>
                  Next
                </button>

              </div>
            )}

          </div>

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
                    <i class="fa-solid fa-indian-rupee-sign"></i> {particularProduct.price} <span className='line-through text-gray-500'>{particularProduct.defaultPrice}</span>
                  </p>

                  <div className="mt-4">
                    <p className="font-bold text-black text-xl">Description : <span className='text-gray-500'>{particularProduct.description} </span></p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold text-black text-xl">Offer : <span className='text-blue-500'>{particularProduct.offer} <i class="fa-solid fa-percent"></i></span></p>
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

                  <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded">
                    Add to Cart
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
