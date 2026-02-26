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
import ProtectedRoute from './ProtectedRoute';

import Dashboard from '../pages/vendor/Dashboard';


import VendorLayout from "../components/layout/VendorLayout";

import AddWatch from "../pages/vendor/AddWatch";
import ManageWatches from "../pages/vendor/ManageWatches";
import VendorOrders from "../pages/vendor/VendorOrders";
import Analytics from "../pages/vendor/Analytics";
import Inventory from "../pages/vendor/Inventory";
import EditWatch from "../pages/vendor/EditWatch";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/watch/:id" element={<WatchDetail />} />
        <Route path="/cart" element={<Cart />} />
        
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/vendor" element={<Dashboard />} />
          <Route path="/vendor/products" element={<ManageWatches />} />
        </Route>
        <Route path="/vendor" element={<VendorLayout />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="add" element={<AddWatch />} />
  <Route path="manage" element={<ManageWatches />} />
  <Route path="orders" element={<VendorOrders />} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="inventory" element={<Inventory />} />
  <Route path="edit/:id" element={<EditWatch />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}