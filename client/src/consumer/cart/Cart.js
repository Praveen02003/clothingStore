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

export const Cart = () => {

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
      var getData = await axios.get(`http://localhost:5000/getAllProduct?page=${currentPage}&category=${category}&price=${price}&search=${searchData}&count=${dynamicPageNumber}`)

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
    setFinalPrice(inputValue)
  }

  // categoryApply function
  function categoryApply(inputValue) {
    setFinalCategory(inputValue)
  }

  // applyFilter function
  function applyFilter() {
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

      <div className="flex flex-col flex-1">

        <Navbar />

        <div className="flex flex-wrap items-center justify-between gap-4 p-4">

          <h2 className="text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-cart-shopping text-2xl"></i>
            My Cart
          </h2>
        </div>

        <div className="p-4">
          <div className="max-h-96 overflow-y-auto overflow-x-auto shadow-md rounded-lg">

            <table className="w-full text-sm text-left text-gray-500">

              <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                <tr className='text-center'>
                  <th className="px-6 py-3">S.no</th>
                  <th className="px-6 py-3">First Name</th>
                  <th className="px-6 py-3">Last Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr className="bg-white text-center border-b hover:bg-gray-50">

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    1
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    t shirt
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bgmn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    dfng dfgn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bfdbdf
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-black me-5 font-bold hover:underline" >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>

                <tr className="bg-white text-center border-b hover:bg-gray-50">

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    1
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    t shirt
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bgmn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    dfng dfgn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bfdbdf
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-black me-5 font-bold hover:underline" >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>

                <tr className="bg-white text-center border-b hover:bg-gray-50">

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    1
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    t shirt
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bgmn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    dfng dfgn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bfdbdf
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-black me-5 font-bold hover:underline" >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>

                <tr className="bg-white text-center border-b hover:bg-gray-50">

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    1
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    t shirt
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bgmn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    dfng dfgn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bfdbdf
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-black me-5 font-bold hover:underline" >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
                
                <tr className="bg-white text-center border-b hover:bg-gray-50">

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    1
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    t shirt
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bgmn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    dfng dfgn
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    bfdbdf
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-black me-5 font-bold hover:underline" >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>
        </div>

        {/* footer section */}
        <Footer />

      </div>


    </div>
  )
}
