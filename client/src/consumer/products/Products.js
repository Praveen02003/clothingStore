import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';
import api from '../../axios/AxiosFile';
import { ImageUrl } from '../../backendUrl/ImageUrl';

export const Products = () => {

  const {
    sideBarOpen,
    setSideBarOpen,
    loginUser,
    setLoginUser,
    userProductAddModal,
    setUserProductAddModal,
    cartCount,
    setCartCount
  } = useContext(mainContext);

  const navigate = useNavigate()

  const [allDatas, setAllDatas] = useState([])

  const [spinnerLoader, setSpinnerLoader] = useState(false);

  const [cartDatas, setcartDatas] = useState([])

  const [particularProduct, setParticularProduct] = useState({})

  const [viewModalOpen, setViewModalOpen] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [dynamicPageNumber, setDynamicPageNumber] = useState(5);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(0);

  // filter and search
  const [finalPrice, setFinalPrice] = useState("");
  const [finalCategory, setFinalCategory] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [searchData, setSearchData] = useState("");

  // logout function
  function logOut() {
    localStorage.removeItem('loginToken')
    localStorage.removeItem('loginUser')
    localStorage.removeItem('consumerSidebarOpen')
    setLoginUser(null)
    navigate('/login')
  }

  // openViewModal function
  async function openViewModal(id) {
    setSpinnerLoader(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await getOneProduct(id)
      setViewModalOpen(true)
    } catch (error) {
      setSpinnerLoader(false)
      console.log(error);
    } finally {
      setSpinnerLoader(false);
    }
  }

  // closeViewModal function
  function closeViewModal() {
    setViewModalOpen(false)
  }

  async function getOneProduct(id) {
    setSpinnerLoader(true)

    try {
      const getOneData = await api.get(`/api/products/getSpecificProduct/${id}`)
      console.log(getOneData.data.data, "==>");
      setParticularProduct(getOneData.data.data)
      setSpinnerLoader(false)

    } catch (error) {
      setSpinnerLoader(false)
      console.log(error?.response?.data?.message);
      // alert(error.response.data.message)
      var message = error?.response?.data?.message
      if (message === "Access denied") {
        logOut()
      }
      else if (message === "Invalid token") {
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

        var getData = await api.post("/api/carts/cartAdd", { data: datas })


        // alert(getData.data.message);
        setSpinnerLoader(false)
        getCartData()

      } catch (error) {
        setSpinnerLoader(false)
        console.log(error?.response?.data?.message);
        // alert(error.response.data.message)
        var message = error?.response?.data?.message
        if (message === "Access denied") {
          logOut()
        }
        else if (message === "Invalid token") {
          logOut()
        }
      }
    }
    else {
      alert("Please login first");
      navigate('/login')
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

        var getData = await api.post("/api/carts/getCartData", { data: datas })

        setcartDatas(getData.data.data)
        setCartCount(getData.data.data.length)
        setSpinnerLoader(false)
        console.log(getData.data.data);

      } catch (error) {
        setSpinnerLoader(false)
        console.log(error?.response?.data?.message);
        // alert(error.response.data.message)
        var message = error?.response?.data?.message
        if (message === "Access denied") {
          logOut()
        }
        else if (message === "Invalid token") {
          logOut()
        }
      }
    }
    else {
      setSpinnerLoader(false)
      alert("Please login first");
    }
  }

  async function getAllProducts() {
    setSpinnerLoader(true)
    try {
      var getData = await api.get(`/api/products/getAllProduct?page=${currentPage}&category=${category}&price=${price}&search=${searchData}&count=${dynamicPageNumber}`)
      console.log(getData.data.data, "===>");

      // pagination concept
      var allData = getData.data.data

      var totalNumberOfData = getData.data.totalPage
      var totalPagesData = Math.ceil(getData.data.totalPage / dynamicPageNumber)

      var calculateStart = (currentPage - 1) * dynamicPageNumber + 1
      var calculateEnd = (parseInt(calculateStart) + parseInt(dynamicPageNumber)) - 1

      setStartValue(calculateStart)
      setEndValue(calculateEnd)
      setAllDatas(allData)
      setTotalPages(totalPagesData)
      setTotalDataCount(totalNumberOfData)
      setSpinnerLoader(false)
    } catch (error) {
      setSpinnerLoader(false)
      console.log(error?.response?.data?.message);
      // alert(error.response.data.message)
      var message = error?.response?.data?.message
      if (message === "Access denied") {
        logOut()
      }
      else if (message === "Invalid token") {
        logOut()
      }
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
    setCurrentPage(1)
    setTimeout(() => {
      setCategory("")
      setPrice("")
      setSearchData(inputValue)
    }, 1500);
  }

  // priceApply function
  function priceApply(inputValue) {
    setFinalPrice(inputValue)
  }

  // categoryApply function
  function categoryApply(inputValue) {
    setFinalCategory(inputValue)
  }

  // applyFilter function
  function applyFilter() {
    setCurrentPage(1)
    setCategory(finalCategory)
    setPrice(finalPrice)
  }
  // clearFilter function
  function clearFilter() {
    setFinalCategory("");
    setFinalPrice("");
    setCategory("");
    setPrice("");
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
  }, [currentPage, category, price, searchData, dynamicPageNumber])

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

        <Navbar />

        <div className="flex flex-wrap items-center justify-between gap-4 p-4">

          <h2 className="text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-shirt text-2xl"></i>
            Products
          </h2>

          <div className="flex flex-wrap items-center gap-3">

            {/* search */}
            <input
              type="search"
              placeholder="Search by name, category"
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
              value={finalPrice}
              onChange={(event) => priceApply(event.target.value)}
            >
              <option value="">Select Price</option>
              <option value="lowest">Lowest</option>
              <option value="highest">Highest</option>
            </select>

            <button className='bg-blue-500 px-4 py-2 rounded text-white' onClick={() => {
              applyFilter()
            }}>
              Apply
            </button>
            {(category || price) && (
              <button className='bg-blue-500 px-4 py-2 rounded text-white' onClick={() => {
                clearFilter()
              }}>
                Clear
              </button>
            )}
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
                    src={`${ImageUrl}/${data.image}`}
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
            })) : (
              <div className="col-span-full flex justify-center items-center py-10">
                <p className="text-red-600 font-bold text-lg">
                  No Product Found
                </p>
              </div>
            )}

          </div>
        </div>

        {/* pagination */}
        {allDatas.length > 0 && (
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
                  src={`${ImageUrl}/${particularProduct.image}`}
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
