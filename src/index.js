import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import axios from 'axios';
import loadable from '@loadable/component';
const NotFound = loadable(() => import('./components/Notfound'))
const Login = loadable(() => import('./components/auth/Login'))
const ForgotPassword = loadable(() => import('./components/auth/ForgotPassword'))
const VerifyForgotPassword = loadable(() => import('./components/auth/VerifyForgotOtp'))
const ResetPassword = loadable(() => import('./components/auth/ResetPassword'))
const Dashboard = loadable(() => import('./components/pages/Dashboard'))
const Users = loadable(() => import('./components/pages/users/Users'))
const CategoriesList = loadable(() => import('./components/pages/categories/List'))
const AddNewCategory = loadable(() => import('./components/pages/categories/AddNew'))
const EditCategory = loadable(() => import('./components/pages/categories/Edit'))


axios.defaults.baseURL = 'http://webmobrildemo.com:9600/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + (localStorage.getItem('transact_auth_back') ? JSON.parse(localStorage.getItem('transact_auth_back')).token : null)

const ProtectedRoute = () => {
  if (!localStorage.getItem('transact_auth_back')) {
    return <Navigate to="/" />
  }
  return <Outlet />
}

const PublicRoute = () => {
  if (localStorage.getItem('transact_auth_back')) {
    return <Navigate to="/dashboard" />
  }
  return <Outlet />
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename='/admin'>
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/otp" element={<VerifyForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/addnew" element={<AddNewCategory />} />
        <Route path="/categories/edit/:id" element={<EditCategory />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
