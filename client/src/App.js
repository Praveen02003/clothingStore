import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './login/Login';
import { Signup } from './signup/Signup';
import { Products } from './consumer/products/Products';
import { AdminProducts } from './admin/products/AdminProducts';
import { Dashboard } from './admin/dashboard/Dashboard';
import { Consumers } from './admin/consumers/Consumers';
import { createContext, useState } from 'react';

export const mainContext = createContext()

function App() {

  // sidebar open
  const [open, setOpen] = useState(false)

  // modal opens
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

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
  return (
    // routes
    <mainContext.Provider value={{
      open,
      setOpen,

      viewModal,
      setViewModal,
      editModal,
      setEditModal,
      deleteModal,
      setDeleteModal,
      addModal,
      setAddModal,


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
      setGetAllAdminDashBoardData

    }}>
      <BrowserRouter>
        <Routes>
          {/* authentication routes */}
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* consumers routes */}
          <Route path='/customers/products' element={<Products />} />

          {/* admin routes */}
          <Route path='/admin/dashBoard' element={<Dashboard />} />
          <Route path='/admin/adminProducts' element={<AdminProducts />} />
          <Route path='/admin/consumers' element={<Consumers />} />
        </Routes>
      </BrowserRouter>
    </mainContext.Provider>
  );
}

export default App;
