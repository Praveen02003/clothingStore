import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../consumer/sidebar/Sidebar';
import { mainContext } from '../../App';
import axios from 'axios';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';

export const Cart = () => {

  const {
    sideBarOpen,
    setSideBarOpen,
    loginUser,
    setLoginUser,
    cartCount,
    setCartCount
  } = useContext(mainContext);

  const navigate = useNavigate()

  const [allDatas, setAllDatas] = useState([])

  const [spinnerLoader, setSpinnerLoader] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0)

  // logout function
  function logOut() {
    localStorage.removeItem('loginToken')
    localStorage.removeItem('loginUser')
    localStorage.removeItem('consumerSidebarOpen')
    setLoginUser(null)
    navigate('/login')
  }

  // calculateTotalAmount function
  function calculateTotalAmount(cartData) {
    let total = 0;

    cartData.forEach((item) => {
      const product = item.product[0];
      const price = product?.price || 0;
      const quantity = item.quantity || 0;

      total += price * quantity;
    });

    setTotalAmount(total);
  }
  // updateQuantity function
  async function updateQuantity(cartId, quantity) {
    setSpinnerLoader(true)
    try {
      const token = localStorage.getItem("loginToken");
      var data = {
        cartId: cartId,
        quantity: quantity
      }

      const updateData = await axios.post(
        "http://localhost:5000/updateCartQuantity", { data: data },
        {
          headers: {
            Authorization: token
          }
        }
      );

      var message = updateData.data.message
      if (message === "quantity updated success") {
        getCartAll()
        setSpinnerLoader(false)
      }
      console.log(message);
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

  // removeFromCart function
  async function removeFromCart(id) {
    setSpinnerLoader(true)
    try {
      const token = localStorage.getItem('loginToken');
      var getData = await axios.get(`http://localhost:5000/removeFromCart/${id}`, {
        headers: {
          Authorization: token
        }
      })

      var message = getData.data.message
      if (message === "item deleted successfully") {
        getCartAll()
        setSpinnerLoader(false)
      }
      console.log(message);
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

  // getCartAll function
  async function getCartAll() {
    setSpinnerLoader(true)
    try {
      const token = localStorage.getItem('loginToken');
      var getData = await axios.get(`http://localhost:5000/getCart/${loginUser._id}`, {
        headers: {
          Authorization: token
        }
      })

      var allData = getData.data.data
      console.log(allData);
      setCartCount(allData.length)


      setAllDatas(allData)

      calculateTotalAmount(allData);
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
  // goToCheckOutPage function
  function goToCheckOutPage() {
    navigate("/consumers/checkOut")
  }

  // authUser function
  function authUser() {
    var user = JSON.parse(localStorage.getItem('loginUser'))
    var token = localStorage.getItem('loginToken')
    console.log(user, "===>");

    if (user && token) {
      setLoginUser(user)
    }
  }

  useEffect(() => {
    try {
      authUser()
    } catch (error) {
      console.log("error");
    }
  }, [])

  useEffect(() => {
    if (loginUser?._id) {
      getCartAll()
    }
  }, [loginUser])

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
            <i className="fa-solid fa-cart-shopping text-2xl"></i>
            My Cart
          </h2>
        </div>

        <div className="p-4">
          <div className="max-h-96 overflow-y-auto overflow-x-auto shadow-md rounded-lg">

            <table className="w-full text-sm text-left text-gray-500">

              <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                <tr className='text-center bg-gray-600 text-white'>
                  <th className="px-6 py-3">S.no</th>
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Offer</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {allDatas.length > 0 ? (
                  allDatas.map((data, index) => {
                    const product = data.product[0];

                    return (
                      <tr key={index} className="bg-white text-center border-b hover:bg-gray-50">

                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {product?.name}
                        </td>

                        <td className="px-6 py-4 font-semibold text-gray-900">
                          <i class="fa-solid fa-dollar-sign"></i> {product?.price}
                        </td>

                        <td className="px-6 py-4 font-semibold text-blue-600">
                          {product?.offer} <i className="fa-solid fa-percent"></i>
                        </td>

                        <td className="px-6 py-4 font-semibold text-green-600">
                          {product?.category}
                        </td>

                        <td className="px-6 py-4 font-semibold text-gray-900">
                          <input
                            type="number"
                            min="1"
                            value={data.quantity}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                            onChange={(event) => {
                              var quantity = Number(event.target.value);
                              var stock = data.product[0]?.stock;

                              if (quantity > stock) {
                                alert(`Only ${stock} items are available`);
                                return;
                              }

                              updateQuantity(data._id, quantity);
                            }}
                          />
                        </td>

                        <td className="px-6 py-4">
                          <button className="text-black me-5 font-bold hover:underline" onClick={() => {
                            removeFromCart(data._id)
                          }}>
                            <i className="fa-solid fa-delete-left"></i>
                          </button>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-red-500 font-bold">
                      No Items in the Cart
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>
        </div>

        {totalAmount > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-4 p-4">

            <button className="text-lg text-white rounded font-bold flex items-center gap-2 bg-gray-700 px-10 py-3" onClick={() => {
              goToCheckOutPage()
            }}>
              <i class="fa-solid fa-dollar-sign"></i> {totalAmount} Checkout
            </button>
          </div>
        )}

        {/* footer section */}
        <Footer />

      </div>


    </div>
  )
}
