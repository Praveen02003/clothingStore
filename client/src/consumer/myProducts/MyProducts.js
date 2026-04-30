import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import axios from 'axios';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';

export const MyProducts = () => {

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

  const [cartDatas, setcartDatas] = useState([])

  const [particularProduct, setParticularProduct] = useState({})

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [spinnerLoader, setSpinnerLoader] = useState(false);

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


  // alert
  const [openAlert, setOpenAlert] = useState(false)
  const [alertColor, setAlertColor] = useState("")
  const [alertContent, setAlertContent] = useState("")

  const [productEditModal, setProductEditModal] = useState(false)
  const [productDeleteModal, setproductDeleteModal] = useState(false)
  const [particularProductId, setParticularProductId] = useState(null)

  const [particularProductData, setParticularProductData] = useState({})

  var [editErrors, setEditErrors] = useState({
    nameError: "",
    defaultPriceError: "",
    offerError: "",
    descriptionError: "",
    stockError: "",
    colorError: "",
    sizeError: "",
    imageError: "",
    categoryError: ""
  })

  var [addErrors, setAddErrors] = useState({
    nameError: "",
    defaultPriceError: "",
    offerError: "",
    descriptionError: "",
    stockError: "",
    colorError: "",
    sizeError: "",
    imageError: "",
    categoryError: ""
  })

  const [addData, setAddData] = useState({
    name: "",
    price: 0,
    defaultPrice: 0,
    offer: "",
    description: "",
    stock: "",
    color: "",
    size: "",
    image: "",
    category: ""
  });

  // logout function
  function logOut() {
    localStorage.removeItem('loginToken')
    localStorage.removeItem('loginUser')
    localStorage.removeItem('consumerSidebarOpen')
    setLoginUser(null)
    navigate('/login')
  }

  // add product validation functions

  // validateName function
  function validateName(inputValue) {
    if (!inputValue) {
      setAddErrors({ ...addErrors, nameError: "Enter Product Name" })
    }
    else {
      setAddErrors({ ...addErrors, nameError: "" })
    }
    setAddData({ ...addData, name: inputValue })
  }
  // validatePrice function
  function validateDefaultPrice(inputValue) {

    if (!inputValue) {
      setAddErrors({ ...addErrors, defaultPriceError: "Enter Product Original Price" })
    }
    if (inputValue <= 0) {
      setAddErrors({ ...addErrors, defaultPriceError: "Enter Product Original Price > 0" })
    }
    else {
      setAddErrors({ ...addErrors, defaultPriceError: "" })
    }
    setAddData({ ...addData, defaultPrice: parseInt(inputValue), price: inputValue })
  }
  // validateOffer function
  function validateOffer(inputValue) {
    let offerPrice = 0;
    let originalPrice = addData.defaultPrice;

    if (inputValue === "" || inputValue === null) {
      setAddErrors({ ...addErrors, offerError: "Enter Offer if no offer type 0" });
    }

    else if (inputValue < 0 || inputValue > 100) {
      setAddErrors({ ...addErrors, offerError: "Enter Offer between 0 and 100" });
    }

    else {
      offerPrice = Math.floor(originalPrice - (originalPrice * inputValue) / 100);
      setAddErrors({ ...addErrors, offerError: "" });
    }

    setAddData({ ...addData, offer: inputValue, price: offerPrice });
  }
  // validateStock function
  function validateStock(inputValue) {
    if (!inputValue) {
      setAddErrors({ ...addErrors, stockError: "Enter Stock" })
    }
    else if (inputValue <= 0) {
      setAddErrors({ ...addErrors, stockError: "Enter Stock > 0" })
    }
    else {
      setAddErrors({ ...addErrors, stockError: "" })
    }
    setAddData({ ...addData, stock: inputValue })
  }

  // validateColor function
  function validateColor(inputValue) {
    if (!inputValue) {
      setAddErrors({ ...addErrors, colorError: "Select Color" })
    }
    else {
      setAddErrors({ ...addErrors, colorError: "" })
    }
    setAddData({ ...addData, color: inputValue })
  }

  // validateSize function
  function validateSize(inputValue) {
    if (!inputValue) {
      setAddErrors({ ...addErrors, sizeError: "Select Size" })
    }
    else {
      setAddErrors({ ...addErrors, sizeError: "" })
    }
    setAddData({ ...addData, size: inputValue })
  }

  // validateImage function
  function validateImage(event) {
    console.log(event, "===>");

    if (event.target.files && event.target.files[0]) {
      setAddErrors({ ...addErrors, imageError: "" })
    }
    else {
      setAddErrors({ ...addErrors, imageError: "Choose Image" })

    }
    setAddData({ ...addData, image: event.target.files[0] })
  }

  // validateCategory function
  function validateCategory(inputValue) {
    if (!inputValue) {
      setAddErrors({ ...addErrors, categoryError: "Enter Category" })
    }
    else {
      setAddErrors({ ...addErrors, categoryError: "" })
    }
    setAddData({ ...addData, category: inputValue })
  }

  // validateDescription function
  function validateDescription(inputValue) {
    if (!inputValue) {
      setAddErrors({ ...addErrors, descriptionError: "Enter Description" })
    }
    else {
      setAddErrors({ ...addErrors, descriptionError: "" })
    }
    setAddData({ ...addData, description: inputValue })

  }

  async function addProduct(event) {
    setSpinnerLoader(true)
    event.preventDefault()
    var errorObject = {}
    // console.log(addData);
    if (!addData.name) {
      errorObject['nameError'] = "Enter Product Name";
    }
    if (!addData.defaultPrice) {
      errorObject['defaultPriceError'] = "Enter Product Original Price";
    }
    if (addData.defaultPrice <= 0) {
      errorObject['defaultPriceError'] = "Enter Product Original Price > 0";
    }

    if (!addData.offer && addData.offer !== 0) {
      errorObject['offerError'] = "Enter Offer if no offer type 0";
    }
    if (addData.offer < 0 || addData.offer > 100) {
      errorObject['offerError'] = "Enter Offer > 0 < 100";
    }
    if (!addData.stock) {
      errorObject['stockError'] = "Enter Stock";
    }
    if (addData.stock <= 0) {
      errorObject['stockError'] = "Enter Stock > 0";
    }
    if (!addData.color) {
      errorObject['colorError'] = "Select Color";
    }
    if (!addData.size) {
      errorObject['sizeError'] = "Select Size";
    }
    if (!addData.image) {
      errorObject['imageError'] = "Choose Image";
    }
    if (!addData.category) {
      errorObject['categoryError'] = "Enter Category";
    }
    if (!addData.description) {
      errorObject['descriptionError'] = "Enter Description";
    }

    setAddErrors(errorObject);

    var values = Object.values(errorObject);
    var boolean = values.some((data, index) => data !== "")
    if (!boolean) {
      console.log(addData);
      const formData = new FormData();
      formData.append("name", addData.name);
      formData.append("price", addData.price);
      formData.append("defaultPrice", addData.defaultPrice);
      formData.append("offer", addData.offer);
      formData.append("description", addData.description);
      formData.append("stock", addData.stock);
      formData.append("color", addData.color);
      formData.append("size", addData.size);
      formData.append("category", addData.category);
      if (addData.image) {
        formData.append("image", addData.image);
      }
      try {
        const token = localStorage.getItem('loginToken');
        const dataAdd = await axios.post("http://localhost:5000/addProducts", formData, {
          headers: {
            Authorization: token
          }
        })
        if (dataAdd.data.message === "Product Added Successfully") {
          getAllProducts()
          setSpinnerLoader(false)
        }
        setAlertContent(dataAdd.data.message)
        setOpenAlert(true)
        setTimeout(() => {
          setOpenAlert(false)
        }, 2000);
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

  }

  // add image removeImage function
  function removeImage() {
    setAddData({ ...addData, image: "" })
    setAddErrors({ ...addErrors, imageError: "Choose Image" })
  }


  // add modal
  function openAddModal() {
    setUserProductAddModal(true)
  }

  function closeAddModal() {
    setUserProductAddModal(false)
    setAddErrors({
      nameError: "",
      defaultPriceError: "",
      offerError: "",
      descriptionError: "",
      stockError: "",
      colorError: "",
      sizeError: "",
      imageError: "",
      categoryError: ""
    })

    setAddData({
      name: "",
      price: 0,
      defaultPrice: 0,
      offer: "",
      description: "",
      stock: "",
      color: "",
      size: "",
      image: "",
      category: ""
    })
  }

  async function getParticularProduct(id) {
    try {
      const token = localStorage.getItem('loginToken');
      const getOneData = await axios.get(`http://localhost:5000/getOneProduct/${id}`, {
        headers: {
          Authorization: token
        }
      })

      console.log(getOneData.data.data, "==>");
      setParticularProductData(getOneData.data.data)

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

  // edit modal
  async function openEditModal(id) {
    setSpinnerLoader(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await getParticularProduct(id)
      setProductEditModal(true)
    } catch (error) {
      console.log(error);
    } finally {
      setSpinnerLoader(false);
    }
  }
  // clodeEditModal function
  function closeEditModal() {
    setProductEditModal(false)
  }

  // edit image removeImage function
  function removeEditImage(product) {
    setParticularProductData({ ...particularProductData, image: "" })
    setEditErrors({ ...editErrors, imageError: "Choose Image" })
  }

  // edit product validation functions

  // validateName function
  function editValidateName(inputValue) {
    if (!inputValue) {
      setEditErrors({ ...editErrors, nameError: "Enter Product Name" })
    }
    else {
      setEditErrors({ ...editErrors, nameError: "" })
    }
    setParticularProductData({ ...particularProductData, name: inputValue })
  }
  // validatePrice function
  function editValidateDefaultPrice(inputValue) {

    if (!inputValue) {
      setEditErrors({ ...editErrors, defaultPriceError: "Enter Product Original Price" })
    }
    else if (inputValue <= 0) {
      setEditErrors({ ...editErrors, defaultPriceError: "Enter Product Original Price > 0" })
    }
    else {
      setEditErrors({ ...editErrors, defaultPriceError: "" })
    }
    setParticularProductData({ ...particularProductData, defaultPrice: inputValue })
  }
  // validateOffer function
  function editValidateOffer(inputValue) {
    let offerPrice = particularProductData.defaultPrice;
    let originalPrice = particularProductData.defaultPrice;

    if (inputValue === "" || inputValue === null) {
      setEditErrors({ ...editErrors, offerError: "Enter Offer if no offer type 0" });
    }

    else if (inputValue < 0 || inputValue > 100) {
      setEditErrors({ ...editErrors, offerError: "Enter Offer between 0 and 100" });
    }

    else {
      offerPrice = Math.floor(originalPrice - (originalPrice * inputValue) / 100);
      setEditErrors({ ...editErrors, offerError: "" });
    }
    setParticularProductData({ ...particularProductData, offer: inputValue, price: offerPrice })
  }
  // validateStock function
  function editValidateStock(inputValue) {
    if (!inputValue) {
      setEditErrors({ ...editErrors, stockError: "Enter Stock" })
    }
    else if (inputValue <= 0) {
      setEditErrors({ ...editErrors, stockError: "Enter Stock > 0" })
    }
    else {
      setEditErrors({ ...editErrors, stockError: "" })
    }
    setParticularProductData({ ...particularProductData, stock: inputValue })
  }

  // validateColor function
  function editValidateColor(inputValue) {
    if (!inputValue) {
      setEditErrors({ ...editErrors, colorError: "Select Color" })
    }
    else {
      setEditErrors({ ...editErrors, colorError: "" })
    }
    setParticularProductData({ ...particularProductData, color: inputValue })
  }

  // validateSize function
  function editValidateSize(inputValue) {
    if (!inputValue) {
      setEditErrors({ ...editErrors, sizeError: "Select Size" })
    }
    else {
      setEditErrors({ ...editErrors, sizeError: "" })
    }
    setParticularProductData({ ...particularProductData, size: inputValue })
  }

  // validateImage function
  function editValidateImage(event) {
    console.log(event, "===>");

    if (event.target.files && event.target.files[0]) {
      setEditErrors({ ...editErrors, imageError: "" })
    }
    else {
      setEditErrors({ ...editErrors, imageError: "Choose Image" })

    }
    setParticularProductData({ ...particularProductData, image: event.target.files[0] })
  }

  // validateCategory function
  function editValidateCategory(inputValue) {
    if (!inputValue) {
      setEditErrors({ ...editErrors, categoryError: "Enter Category" })
    }
    else {
      setEditErrors({ ...editErrors, categoryError: "" })
    }
    setParticularProductData({ ...particularProductData, category: inputValue })
  }

  // validateDescription function
  function editValidateDescription(inputValue) {
    if (!inputValue) {
      setEditErrors({ ...editErrors, descriptionError: "Enter Description" })
    }
    else {
      setEditErrors({ ...editErrors, descriptionError: "" })
    }
    setParticularProductData({ ...particularProductData, description: inputValue })
  }

  async function updateProduct(event) {
    event.preventDefault()
    var errorObject = {}
    // console.log(addData);
    if (!particularProductData.name) {
      errorObject['nameError'] = "Enter Product Name";
    }
    if (!particularProductData.defaultPrice) {
      errorObject['defaultPriceError'] = "Enter Product Original Price";
    }
    if (particularProductData.defaultPrice <= 0) {
      errorObject['defaultPriceError'] = "Enter Product Original Price > 0";
    }

    if (!particularProductData.offer && particularProductData.offer !== 0) {
      errorObject['offerError'] = "Enter Offer if no offer type 0";
    }
    if (particularProductData.offer < 0 || particularProductData.offer > 100) {
      errorObject['offerError'] = "Enter Offer > 0 < 100";
    }
    if (!particularProductData.stock) {
      errorObject['stockError'] = "Enter Stock";
    }
    if (particularProductData.stock <= 0) {
      errorObject['stockError'] = "Enter Stock > 0";
    }
    if (!particularProductData.color) {
      errorObject['colorError'] = "Select Color";
    }
    if (!particularProductData.size) {
      errorObject['sizeError'] = "Select Size";
    }
    if (!particularProductData.image) {
      errorObject['imageError'] = "Choose Image";
    }
    if (!particularProductData.category) {
      errorObject['categoryError'] = "Enter Category";
    }
    if (!particularProductData.description) {
      errorObject['descriptionError'] = "Enter Description";
    }

    setEditErrors(errorObject);

    var values = Object.values(errorObject);
    var boolean = values.some((data, index) => data !== "")
    if (!boolean) {
      console.log(particularProductData);
      const formData = new FormData();
      formData.append("name", particularProductData.name);
      formData.append("price", particularProductData.price);
      formData.append("defaultPrice", particularProductData.defaultPrice);
      formData.append("offer", particularProductData.offer);
      formData.append("description", particularProductData.description);
      formData.append("stock", particularProductData.stock);
      formData.append("color", particularProductData.color);
      formData.append("size", particularProductData.size);
      formData.append("category", particularProductData.category);
      formData.append("image", particularProductData.image);
      try {
        const token = localStorage.getItem('loginToken');
        const dataEdit = await axios.post("http://localhost:5000/upateProducts", formData, {
          headers: {
            Authorization: token
          }
        })
        if (dataEdit.data.message === "Product Updated Successfully") {

          setAlertContent(dataEdit.data.message)
          setOpenAlert(true)
          setTimeout(() => {
            setOpenAlert(false)
            closeEditModal()
          }, 2000);
        }
        else {
          setAlertContent(dataEdit.data.message)
          setOpenAlert(true)
          setTimeout(() => {
            setOpenAlert(false)
          }, 2000);
        }
        getAllProducts();
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

  async function getAllProducts() {
    console.log(loginUser?._id, "-->");
    setSpinnerLoader(true)

    try {
      const token = localStorage.getItem('loginToken');
      var getData = await axios.get(`http://localhost:5000/getMyProduct/${loginUser._id}?page=${currentPage}&category=${category}&price=${price}&search=${searchData}&count=${dynamicPageNumber}`, {
        headers: {
          Authorization: token
        }
      })
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

  function authUser() {
    var user = JSON.parse(localStorage.getItem('loginUser'))
    var token = localStorage.getItem('loginToken')
    console.log(user, "===>");

    if (user && token) {
      setLoginUser(user)
    }
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


  // delete modal
  function openDeleteModal(id) {
    setproductDeleteModal(true)
    setParticularProductId(id)
  }
  function closeDeleteModal() {
    setproductDeleteModal(false)
  }

  async function deleteParticularProduct(id) {
    try {
      const token = localStorage.getItem('loginToken');
      const deleteOneData = await axios.get(`http://localhost:5000/deleteParticularProduct/${id}`, {
        headers: {
          Authorization: token
        }
      })
      console.log(deleteOneData.data.message, "==>");
      // alert(deleteOneData.data.message)
      if (deleteOneData.data.message === "Product Deleted Successfully") {
        setAlertContent(deleteOneData.data.message)
        setOpenAlert(true)
        setTimeout(() => {
          setOpenAlert(false)
          closeDeleteModal();
        }, 2000);
      }
      else {
        setAlertContent(deleteOneData.data.message)
        setOpenAlert(true)
        setTimeout(() => {
          setOpenAlert(false)
        }, 2000);
      }
      getAllProducts();

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
        console.log(getData.data.data);
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
    authUser()
  }, [])

  useEffect(() => {
    if (loginUser?._id) {
      getAllProducts()
      getCartData()
    }
  }, [loginUser, currentPage, category, price, searchData, dynamicPageNumber])

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
            My Products
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
            {loginUser && (
              <button className='bg-green-700 px-4 py-2 rounded text-white' onClick={() => {
                openAddModal()
              }}>
                <i className="fa-solid fa-plus"></i> Add Product
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
                <div key={index} className="rounded-lg p-3 shadow-sm">

                  <img
                    src={`http://localhost:5000/uploadingImages/${data.image}`}
                    className="w-full h-60 object-contain bg-gray-100 rounded-md"
                  />

                  <div className="mt-3 flex justify-between items-start">
                    <div className="flex-1">

                      <h3
                        className="text-sm font-bold hover:underline cursor-pointer"
                        onClick={() => openViewModal(data._id)}
                      >
                        {data.name}
                      </h3>

                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        {data.color}
                      </p>

                      <div className="flex items-center gap-1">
                        {ratings(data.rating)}
                      </div>

                    </div>

                    <div className="flex flex-col items-end gap-2">

                      <p className="text-sm font-bold text-blue-600 flex items-center gap-1">
                        <i className="fa-solid fa-dollar-sign"></i>
                        {data.price}
                      </p>

                      <button
                        className="text-sm text-gray-600"
                        onClick={() => openEditModal(data._id)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="text-sm text-gray-600"
                        onClick={() => openDeleteModal(data._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>

                    </div>

                  </div>
                </div>
              )
            })) : (
              <div className="col-span-full flex justify-center items-center py-10">
                <p className="text-red-600 font-bold text-lg">
                  No Products Added By You
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

        {/* add product modal */}
        {userProductAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

            <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

              <button
                onClick={() => closeAddModal()}
                className="absolute top-4 right-4 text-gray-500"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>

              <h2 className="text-xl font-bold mb-4">Add Product</h2>

              {/* alert */}
              {openAlert && (
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span class="block sm:inline">{alertContent}</span>
                </div>
              )}

              <form onSubmit={(event) => { addProduct(event) }}>

                <div className="block">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter name"
                    value={addData.name}
                    onInput={(event) => {
                      validateName(event.target.value)
                    }}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.nameError}
                  </p>
                </div>

                <div className="block">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter default price"
                    min="1"
                    value={addData.defaultPrice}
                    onInput={(event) => {
                      validateDefaultPrice(event.target.value)
                    }}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.defaultPriceError}
                  </p>
                </div>

                <div className="block">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter sale price"
                    readOnly
                    value={addData.price}
                  />
                </div>

                <div className="block">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter offer"
                    min="0"
                    onInput={(event) => {
                      validateOffer(event.target.value)
                    }}
                    value={addData.offer}

                  />

                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.offerError}
                  </p>
                </div>
                <div className="block">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter stock"
                    min="1"
                    onInput={(event) => {
                      validateStock(event.target.value)
                    }}
                    value={addData.stock}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.stockError}
                  </p>
                </div>
                <div className="block sm:w-100">
                  <select className="w-full border rounded px-3 py-2" onChange={(event) => {
                    validateColor(event.target.value)
                  }} value={addData.color}>
                    <option value="">Select Color</option>
                    <option value="blue">blue</option>
                    <option value="red">red</option>
                    <option value="green">green</option>
                    <option value="yellow">yellow</option>
                    <option value="orange">orange</option>
                    <option value="white">white</option>
                  </select>
                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.colorError}
                  </p>
                </div>
                <div className="block sm:w-100">
                  <select className="w-full border rounded px-3 py-2" onChange={(event) => {
                    validateSize(event.target.value)
                  }} value={addData.size}>
                    <option value="">Select Size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="L">40</option>
                    <option value="L">42</option>
                    <option value="XL">XL</option>
                  </select>
                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.sizeError}
                  </p>
                </div>
                <div className="block">
                  <input
                    type="file"
                    className="w-full border rounded px-3 py-2"
                    onChange={(event) => {
                      validateImage(event)
                    }}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.imageError}
                  </p>
                  {addData.image && (
                    <div className="relative inline-block">
                      <img
                        src={URL.createObjectURL(addData.image)}
                        alt="Thumb"
                        className="w-24 h-24 object-cover rounded-lg border shadow"
                      />
                      <button className="absolute top-1 right-1 bg-red-500 text-white text-xs h-6 px-3 py-3 ms-3 rounded flex items-center justify-center shadow" onClick={() => { removeImage() }}>
                        <i class="fa-solid fa-xmark"></i>
                      </button>

                    </div>
                  )}
                </div>

                <div className="block">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter category"
                    onInput={(event) => {
                      validateCategory(event.target.value)
                    }}
                    value={addData.category}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.categoryError}
                  </p>
                </div>
                <div className="block">
                  <textarea className="w-full border rounded px-3 py-2" placeholder='Enter description' onInput={(event) => {
                    validateDescription(event.target.value)
                  }} value={addData.description}></textarea>
                  <p className="text-sm text-red-500 mb-0">
                    {addErrors.descriptionError}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Add
                </button>

              </form>

            </div>
          </div>
        )}

        {/* edit product modal */}
        {productEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

            <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6 relative">

              <button
                onClick={() => closeEditModal()}
                className="absolute top-4 right-4 text-gray-500"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>

              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              {/* alert */}
              {openAlert && (
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span class="block sm:inline">{alertContent}</span>
                </div>
              )}
              <form onSubmit={(event) => { updateProduct(event) }}>

                <div className="block">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter name"
                    value={particularProductData.name}
                    onInput={(event) => {
                      editValidateName(event.target.value)
                    }}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.nameError}
                  </p>
                </div>

                <div className="block">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter default price"
                    min="1"
                    value={particularProductData.defaultPrice}
                    onInput={(event) => {
                      editValidateDefaultPrice(event.target.value)
                    }}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.defaultPriceError}
                  </p>
                </div>

                <div className="block">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter sale price"
                    readOnly
                    value={particularProductData.price}
                  />
                </div>

                <div className="block">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter offer"
                    min="0"
                    onInput={(event) => {
                      editValidateOffer(event.target.value)
                    }}
                    value={particularProductData.offer}

                  />

                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.offerError}
                  </p>
                </div>
                <div className="block">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter stock"
                    min="1"
                    onInput={(event) => {
                      editValidateStock(event.target.value)
                    }}
                    value={particularProductData.stock}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.stockError}
                  </p>
                </div>
                <div className="block sm:w-100">
                  <select className="w-full border rounded px-3 py-2" onChange={(event) => {
                    editValidateColor(event.target.value)
                  }} value={particularProductData.color}>
                    <option value="">Select Color</option>
                    <option value="blue">blue</option>
                    <option value="red">red</option>
                    <option value="green">green</option>
                    <option value="yellow">yellow</option>
                    <option value="orange">orange</option>
                    <option value="white">white</option>
                  </select>
                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.colorError}
                  </p>
                </div>
                <div className="block sm:w-100">
                  <select className="w-full border rounded px-3 py-2" onChange={(event) => {
                    editValidateSize(event.target.value)
                  }} value={particularProductData.size}>
                    <option value="">Select Size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="L">40</option>
                    <option value="L">42</option>
                    <option value="XL">XL</option>
                  </select>
                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.sizeError}
                  </p>
                </div>
                <div className="block">
                  <input
                    type="file"
                    className="w-full border rounded px-3 py-2"
                    onChange={(event) => {
                      editValidateImage(event)
                    }}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.imageError}
                  </p>
                  {particularProductData.image && (
                    <div className="relative inline-block">
                      <img src={
                        typeof (particularProductData.image) === "string"
                          ? `http://localhost:5000/uploadingImages/${particularProductData.image}`
                          : URL.createObjectURL(particularProductData.image)
                      }
                        alt="Thumb"
                        className="w-24 h-24 object-cover rounded-lg border shadow"
                      />
                      <button className="absolute top-1 right-1 bg-red-500 text-white text-xs h-6 px-3 py-3 ms-3 rounded flex items-center justify-center shadow" onClick={() => { removeEditImage(getParticularProduct) }}>
                        <i class="fa-solid fa-xmark"></i>
                      </button>

                    </div>

                  )}
                </div>

                <div className="block">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter category"
                    onInput={(event) => {
                      editValidateCategory(event.target.value)
                    }}
                    value={particularProductData.category}
                  />
                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.categoryError}
                  </p>
                </div>
                <div className="block">
                  <textarea className="w-full border rounded px-3 py-2" placeholder='Enter description' onInput={(event) => {
                    editValidateDescription(event.target.value)
                  }} value={particularProductData.description}></textarea>
                  <p className="text-sm text-red-500 mb-0">
                    {editErrors.descriptionError}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Update
                </button>

              </form>

            </div>
          </div>
        )}

        {/* delete confirmation modal */}
        {productDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

            <div className="bg-white rounded-lg shadow-xl p-6">

              <div className="flex items-start gap-4">
                <div>
                  {/* alert */}
                  {openAlert && (
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                      <span class="block sm:inline">{alertContent}</span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-red-600">
                    Delete Confirmation
                  </h3>

                  <p className="mt-2 text-black text-lg font-bold">
                    Are you sure you want to delete the product ?
                  </p>
                </div>

              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2">

                <button onClick={() => { deleteParticularProduct(particularProductId) }} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">
                  Delete
                </button>

                <button onClick={() => closeDeleteModal()} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                  Cancel
                </button>

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
