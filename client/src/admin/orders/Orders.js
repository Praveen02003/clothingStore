import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../sidebar/Sidebar'
import { mainContext } from '../../App';
import axios from 'axios';
import { AdminFooter } from '../footer/Footer';
import { AdminNavbar } from '../navbar/AdminNavbar';

export const Orders = () => {

  const {
    sideBarOpen,
    setSideBarOpen,
    loginUser,
    setLoginUser
  } = useContext(mainContext);

  const navigate = useNavigate()

  const [myOrderDatas, setMyOrderDatas] = useState([])

  const [getParticularOrder, setGetParticularOrder] = useState({})

  const [viewOrderModal, setViewOrderModal] = useState(false)

  const [totalPrice, setTotalPrice] = useState(0)

  // getMyOrders function
  async function getMyOrders() {
    try {
      const token = localStorage.getItem('loginToken');
      var getData = await axios.get(`http://localhost:5000/getAllOrders`, {
        headers: {
          Authorization: token
        }
      })

      var allData = getData.data.data
      console.log(allData);

      setMyOrderDatas(allData)

    } catch (error) {
      console.log(error);
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

  // viewOrder function
  function viewOrder(id) {
    getParticularOrderDetails(id)
    setViewOrderModal(true)
  }

  async function getParticularOrderDetails(id) {
    try {
      const token = localStorage.getItem('loginToken');
      var getData = await axios.get(`http://localhost:5000/getParticularOrder/${id}`, {
        headers: {
          Authorization: token
        }
      })

      var allData = getData.data.data[0]
      console.log(allData);

      setGetParticularOrder(allData)

    } catch (error) {
      console.log(error);
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
      getMyOrders()
    }
  }, [loginUser])

  return (
    <div
      className={`flex-1 transition-all duration-300 
                ${sideBarOpen ? "ml-64" : "ml-16"}`} >

      {/* sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">

        <AdminNavbar />

        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-folder-closed"></i>
            My Orders
          </h2>
        </div>

        {/* orders table */}
        <div className="p-4">
          <div className="max-h-96 overflow-y-auto overflow-x-auto shadow-md rounded-lg bg-white">

            <table className="w-full text-sm text-left">

              <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 shadow">
                <tr className="text-center bg-gray-600 text-white">
                  <th className="px-6 py-3">S.no</th>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Total Items</th>
                  <th className="px-6 py-3">Total Price</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {myOrderDatas.map((data, index) => {
                  var user = data.orderUser[0]
                  return (
                    <tr className="bg-white text-center border-b font-bold" key={index}>
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{data._id}</td>
                      <td className="px-6 py-4">{user.firstName}.{user.lastName}</td>
                      <td className="px-6 py-4 font-semibold">{data.status}</td>
                      <td className="px-6 py-4">{data.orderProduct?.length}</td>
                      <td className="px-6 py-4">
                        <i class="fa-solid fa-indian-rupee-sign"></i> {data.orderHistory.reduce((acc, item) => acc + item.totalPrice, 0)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-black me-5 font-bold hover:underline" onClick={() => {
                          viewOrder(data._id)
                        }}>
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })}


              </tbody>

            </table>

          </div>
        </div>
        {/* view order modal */}
        {viewOrderModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white w-[90%] md:w-[650px] p-6 rounded-lg relative">

              <button
                onClick={() => setViewOrderModal(false)}
                className="absolute top-3 right-3 text-gray-500"
              >
                <i class="fa-solid fa-circle-xmark"></i>
              </button>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i class="fa-regular fa-folder-open"></i>
                Order Details
              </h2>

              <div className="space-y-3 text-sm">

                <div>
                  <p className="font-bold text-black text-lg">Order id:</p>
                  <p className="text-black text-sm">{getParticularOrder._id}</p>
                </div>

                <div>
                  <p className="font-bold text-black text-lg">Customer name:</p>
                  <p className="text-black text-sm">{getParticularOrder?.orderUser?.[0]?.firstName}.{getParticularOrder?.orderUser?.[0]?.lastName}</p>
                </div>

                <div>
                  <p className="font-bold text-black text-lg">Status:</p>
                  <p className="text-black text-sm">{getParticularOrder.status}</p>
                </div>

                <div>
                  <p className="font-bold text-black text-lg">Order Date:</p>
                  <p className="text-black text-sm">{new Date(getParticularOrder.addedOn).toLocaleDateString()}</p>
                </div>

              </div>

              <div className="mt-5 border-t pt-4">

                <h3 className="font-bold mb-2 border-b-4 border-black text-lg">Ordered Products : </h3>

                <div className="space-y-2">
                  {getParticularOrder?.orderProduct?.map((productData, productIndex) => {
                    var getQuantity = getParticularOrder?.orderHistory
                    return (
                      <div className="flex justify-between text-sm pb-2 ">
                        <p className='text-black text-lg'>{productData.name} <span className='text-black font-bold'>({productData.category})</span></p>
                        <p className='text-black text-sm'><i class="fa-solid fa-indian-rupee-sign"></i> {productData.price} x {getQuantity[productIndex].quantity}</p>
                      </div>
                    )
                  })}

                </div>
              </div>


              <div className="mt-4 flex justify-between font-bold text-lg pt-3 border-t-4 border-black">
                <p className="font-bold text-black text-lg">Total Price</p>
                <p className="font-bold text-black text-sm"><i class="fa-solid fa-indian-rupee-sign"></i> {getParticularOrder?.orderHistory?.reduce((acc, item) => acc + item.totalPrice, 0)}</p>
              </div>

            </div>
          </div>
        )}
        {/* footer section */}
        <AdminFooter />

      </div>
    </div>
  )
}
