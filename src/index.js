import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import axios from 'axios';
import loadable from '@loadable/component';
import { useNavigate } from 'react-router-dom';

const NotFound = loadable(() => import('./components/Notfound'))
const Login = loadable(() => import('./components/auth/Login'))
const ForgotPassword = loadable(() => import('./components/auth/ForgotPassword'))
const VerifyForgotPassword = loadable(() => import('./components/auth/VerifyForgotOtp'))
const ResetPassword = loadable(() => import('./components/auth/ResetPassword'))
const Dashboard = loadable(() => import('./components/pages/Dashboard'))
const Users = loadable(() => import('./components/pages/users/Users'))
// Categories import
const CategoriesList = loadable(() => import('./components/pages/categories/List'))
const AddNewCategory = loadable(() => import('./components/pages/categories/AddNew'))
const EditCategory = loadable(() => import('./components/pages/categories/Edit'))

// Experience import
const ExperienceList = loadable(() => import('./components/pages/experience/List'))
const AddNewExperience = loadable(() => import('./components/pages/experience/AddNew'))
const EditExperience = loadable(() => import('./components/pages/experience/Edit'))

// Salary import
const SalaryList = loadable(() => import('./components/pages/salary/List'))
const AddNewSalary = loadable(() => import('./components/pages/salary/AddNew'))
const EditSalary = loadable(() => import('./components/pages/salary/Edit'))

// Skills import
const SkillList = loadable(() => import('./components/pages/skills/List'))
const AddNewSkill = loadable(() => import('./components/pages/skills/AddNew'))
const EditSkill = loadable(() => import('./components/pages/skills/Edit'))

let navigate = null

axios.defaults.baseURL = 'http://webmobrildemo.com:9600/';
//  Request interceptor
axios.interceptors.request.use(request => {
  let bearertoken = localStorage.getItem('transact_auth_back')
  if (bearertoken !== null) {
    bearertoken = JSON.parse(bearertoken).token
  }
  // console.log('in request interceptor', bearertoken);
  request.headers['Authorization'] = 'Bearer ' + bearertoken
  return request
})
//  response interceptor
axios.interceptors.response.use(response => {
  // console.log("success part");
  return response
}, error => {
  if (error.response) {
    if (error.response.status === 401) {
      localStorage.removeItem('transact_auth_back')
      navigate('/');
    }
  }
  return Promise.reject(error);
})

const ProtectedRoute = () => {
  navigate = useNavigate()
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
        {/* Categories Start */}
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/addnew" element={<AddNewCategory />} />
        <Route path="/categories/edit/:id" element={<EditCategory />} />
        {/* Categories End */}

        {/* Experience Start */}
        <Route path="/experience" element={<ExperienceList />} />
        <Route path="/experience/addnew" element={<AddNewExperience />} />
        <Route path="/experience/edit/:id" element={<EditExperience />} />
        {/* Experience End */}

        {/* Salary Start*/}
        <Route path="/salary" element={<SalaryList />} />
        <Route path="/salary/addnew" element={<AddNewSalary />} />
        <Route path="/salary/edit/:id" element={<EditSalary />} />
        {/* salary End*/}


        {/* Skill Start*/}
        <Route path="/skills" element={<SkillList />} />
        <Route path="/skills/addnew" element={<AddNewSkill />} />
        <Route path="/skills/edit/:id" element={<EditSkill />} />
        {/* skill End*/}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
