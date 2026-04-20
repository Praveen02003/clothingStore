import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './login/Login';
import { Signup } from './signup/Signup';
import { Products } from './consumer/products/Products';
import { AdminProducts } from './admin/products/AdminProducts';
import { Dashboard } from './admin/dashboard/Dashboard';
import { Consumers } from './admin/consumers/Consumers';

function App() {
  return (
    // routes
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/customers/products' element={<Products />} />
          <Route path='/admin/adminProducts' element={<AdminProducts />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/consumers' element={<Consumers />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
