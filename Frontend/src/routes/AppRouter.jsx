import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from '../pages/Landing';
import Home from '../pages/customer/Home';
import Catalog from '../pages/customer/Catalog';
import WatchDetail from '../pages/customer/WatchDetail';
import Cart from '../pages/customer/Cart';
import Profile from '../pages/customer/Profile';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import Dashboard from '../pages/vendor/Dashboard';
import ManageWatches from '../pages/vendor/ManageWatches';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/watch/:id" element={<WatchDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        
        <Route path="/vendor" element={<Dashboard />} />
        <Route path="/vendor/products" element={<ManageWatches />} />
      </Routes>
    </BrowserRouter>
  );
}