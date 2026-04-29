import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './login/Login';
import { Signup } from './signup/Signup';
import { Products } from './consumer/products/Products';
import { Cart } from './consumer/cart/Cart';
import { AdminProducts } from './admin/products/AdminProducts';
import { Dashboard } from './admin/dashboard/Dashboard';
import { Consumers } from './admin/consumers/Consumers';
import { UserDashboard } from './consumer/dashboard/UserDashboard';

import { createContext, useState } from 'react';
import { ForgetPassword } from './forget/ForgetPassword';
import { MyProducts } from './consumer/myProducts/MyProducts';
import { Checkout } from './consumer/checkout/Checkout';
import { Payment } from './consumer/payment/Payment';
import { MyOrders } from './consumer/myOrders/MyOrders';
import { Orders } from './admin/orders/Orders';

export const mainContext = createContext()

function App() {

  // sidebar open
  const [open, setOpen] = useState(false)
  const [sideBarOpen, setSideBarOpen] = useState(false)

  // modal opens
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [userProductAddModal, setUserProductAddModal] = useState(false);

  // admin
  // admin products page
  const [allProducts, setAllProducts] = useState([]);
  const [getParticularProduct, setGetParticularProduct] = useState({});
  const [particularProductId, setParticularProductId] = useState(null);

  // admin consumers page
  const [allConsumers, setAllConsumers] = useState([]);
  const [getParticularConsumer, setGetParticularConsumer] = useState({});
  const [particularConsumerId, setParticularConsumerId] = useState(null);

  // admin dashboard page
  const [getAllAdminDashBoardData, setGetAllAdminDashBoardData] = useState({});

  // consumer
  const [loginUser, setLoginUser] = useState(null)
  return (
    // routes
    <mainContext.Provider value={{
      open,
      setOpen,

      sideBarOpen,
      setSideBarOpen,

      viewModal,
      setViewModal,
      editModal,
      setEditModal,
      deleteModal,
      setDeleteModal,
      addModal,
      setAddModal,
      userProductAddModal,
      setUserProductAddModal,


      allProducts,
      setAllProducts,
      getParticularProduct,
      setGetParticularProduct,
      particularProductId,
      setParticularProductId,

      allConsumers,
      setAllConsumers,
      getParticularConsumer,
      setGetParticularConsumer,
      particularConsumerId,
      setParticularConsumerId,

      getAllAdminDashBoardData,
      setGetAllAdminDashBoardData,

      loginUser,
      setLoginUser

    }}>
      <BrowserRouter>
        <Routes>
          {/* authentication routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* consumers routes */}
          <Route path='/' element={<UserDashboard />} />
          <Route path='/consumers/products' element={<Products />} />
          <Route path='/consumer/resetPassword' element={<ForgetPassword />} />
          <Route path='/consumers/cart' element={<Cart />} />
          <Route path='/consumers/myProducts' element={<MyProducts />} />
          <Route path='/consumers/checkOut' element={<Checkout />} />
          <Route path='/consumers/payment' element={<Payment />} />
          <Route path='/consumers/myOrders' element={<MyOrders />} />

          {/* admin routes */}
          <Route path='/admin/dashBoard' element={<Dashboard />} />
          <Route path='/admin/adminProducts' element={<AdminProducts />} />
          <Route path='/admin/consumers' element={<Consumers />} />
          <Route path='/admin/orders' element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </mainContext.Provider>
  );
}

export default App;
