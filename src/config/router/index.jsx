import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../../pages/home/index.jsx";
import Login from "../../pages/auth/login/index.jsx";
import Register from "../../pages/auth/register/index.jsx";
import AllProducts from "../../pages/product/allProducts/index.jsx"
import Products from "../../pages/product/index.jsx";
import ForgetPassword from "../../pages/auth/forget-password/index.jsx";
import CategoryProduct from "../../pages/product/category/index.jsx";
import ProductBestSeller from "../../pages/product/bestSeller/index.jsx"
import UserProfile from "../../pages/profile/user/index.jsx"
import ChangePassword from "../../pages/profile/user/change-password/index.jsx";
import Profile from "../../pages/profile/index.jsx";
import AddressBook from "../../pages/profile/user/address-book/index.jsx";
import PaymentOption from "../../pages/profile/user/payment-option/index.jsx";
import Cart from "../../pages/cart/index.jsx";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Navigate to="/home" replace="true" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<Profile/>} />
            <Route path="/forget-password" element={<ForgetPassword/>} />
            <Route path="/cart" element={<Cart/>}/>
            <Route path='/products' element={<AllProducts/>} />
            <Route path="/products/name/:name" element={<Products />} />
            <Route path="/products/categories/:name" element={<CategoryProduct/>} />
            <Route path="/products/best-seller" element={<ProductBestSeller/>} />
            {/* User */}
            <Route path="/profile/user/:id" element={<UserProfile/>}/>
            <Route path="/profile/user/:id/change-password" element={<ChangePassword/>} />
            <Route path="/profile/user/:id/address-book" element={<AddressBook/>} />
            <Route path="/profile/user/:id/payment-option" element={<PaymentOption />} />
      
            {/* User End */}
            {/* Admin */}
            
            {/* Admin End */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
