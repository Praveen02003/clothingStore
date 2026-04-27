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

export const Products = () => {

  const {
    sideBarOpen,
    setSideBarOpen,
    loginUser,
    setLoginUser
  } = useContext(mainContext);

  const navigate = useNavigate()

  const [allDatas, setAllDatas] = useState([])

  const [particularProduct, setParticularProduct] = useState({})

  const [viewModalOpen, setViewModalOpen] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [searchData, setSearchData] = useState("");

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

  async function getAllProducts() {
    try {
      var getData = await axios.get(`http://localhost:5000/getAllProduct?page=${currentPage}&category=${category}&price=${price}&search=${searchData}`)

      var allData = getData.data.data
      var totalPage = Math.ceil(getData.data.totalPage / 5)
      console.log(allData);
      console.log(totalPage);

      setAllDatas(allData)
      setTotalPages(totalPage)
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

  // pagination functionality
  var totalPagesArrray = [];

  function pagination() {
    console.log(totalPages,"---->");
    
    for (let index = 0; index < totalPages; index++) {
      totalPagesArrray.push(index)
    }
  }

  pagination()

  // next function
  function next() {
    setCurrentPage(currentPage + 1)
  }

  // previous function
  function previous() {
    setCurrentPage(currentPage - 1)
  }

  // search function
  function search(inputValue) {
    setTimeout(() => {
      setCategory("")
      setPrice("")
      setSearchData(inputValue)
    }, 1500);
  }

  // priceApply function
  function priceApply(inputValue) {
    setCategory("")
    setSearchData("")
    setPrice(inputValue)
  }

  // categoryApply function
  function categoryApply(inputValue) {
    setPrice("")
    setSearchData("")
    setCategory(inputValue)
  }

  // ratings function
  function ratings(loopValue) {
    var ratingsArray = []
    for (let index = 0; index < loopValue; index++) {
      var fontAwesomeStars = <i className="fa-solid fa-star text-yellow-600" key={index}></i>
      ratingsArray.push(fontAwesomeStars)
    }
    
    return ratingsArray;
  }



  useEffect(() => {
    try {
      authUser()
    } catch (error) {
      console.log("error");

    }
  }, [currentPage, category, price, searchData])

  return (
    <div className="flex h-screen">

      {/* sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">

        <Navbar />

        <div className="flex flex-wrap items-center justify-between gap-4 p-4">

          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fa-brands fa-product-hunt"></i>
            Our Products
          </h2>

          {/* Right Side Controls */}
          <div className="flex flex-wrap items-center gap-3">

            {/* search */}
            <input
              type="text"
              placeholder="search by name,category"
              className="w-48 border border-black rounded px-3 py-2 text-sm"
              onInput={(event) => { search(event.target.value) }}
            />

            {/* category select */}
            <select
              className="w-40 border border-black rounded-md px-3 py-2 text-sm"
              onChange={(event) => categoryApply(event.target.value)}
            >
              <option value="">Select Category</option>
              <option value="kurti">Kurti</option>
              <option value="tshirt">T-Shirt</option>
              <option value="jeans">Jeans</option>
              <option value="shirt">Shirt</option>
              <option value="hoodie">Hoodie</option>
              <option value="pants">Pants</option>
              <option value="jacket">Jacket</option>
            </select>

            {/* price select */}
            <select
              className="w-40 border border-black rounded-md px-3 py-2 text-sm"
              onChange={(event) => priceApply(event.target.value)}
            >
              <option value="">Select Price</option>
              <option value="lowest">Lowest</option>
              <option value="highest">Highest</option>
            </select>

          </div>

        </div>

        {/* Product Grid */}
        <div className="bg-white p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Product Card */}

            {allDatas.length > 0 ? (allDatas.map((data, index) => {
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
                        {ratings(data.rating)}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-blue-600"> <i className="fa-solid fa-indian-rupee-sign"></i> {data.price}</p>
                  </div>
                </div>
              )
            })) : (
              <div className="flex items-center w-full">
                <p className="text-red-600 font-bold text-lg">
                  No Product Found
                </p>
              </div>
            )}

          </div>
        </div>

        <div className="flex text-center justify-center h-screen border-t bg-white px-4 py-3">

          <div className="sm:flex sm:flex-1 sm:items-center sm:justify-center">

            {/* pagination */}
            {totalPagesArrray.length > 0 && (
              <div className="flex items-center gap-1 mt-4">

                <button
                  className={`px-2 py-1 border rounded ${currentPage === 1 ? "bg-gray-500" : "bg-white"}`}
                  onClick={() => previous()}
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
                  onClick={() => next()}
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
