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
const ChangePassword = loadable(() => import('./components/auth/ChangePassword'))
// Categories import
const CategoriesList = loadable(() => import('./components/pages/categories/List'))
const AddNewCategory = loadable(() => import('./components/pages/categories/AddNew'))
const EditCategory = loadable(() => import('./components/pages/categories/Edit'))

// Blogs import
const BlogsList = loadable(() => import('./components/pages/blogs/List'))
const AddNewBlog = loadable(() => import('./components/pages/blogs/AddNew'))
const EditBlog = loadable(() => import('./components/pages/blogs/Edit'))

// Experience import
const ExperienceList = loadable(() => import('./components/pages/experience/List'))
const AddNewExperience = loadable(() => import('./components/pages/experience/AddNew'))
const EditExperience = loadable(() => import('./components/pages/experience/Edit'))

// Responsibilities import
const ResponsibilitiesList = loadable(() => import('./components/pages/responsibilities/List'))
const AddNewResponsibility = loadable(() => import('./components/pages/responsibilities/AddNew'))
const EditResponsibility = loadable(() => import('./components/pages/responsibilities/Edit'))

// Involvements import
const InvolvementList = loadable(() => import('./components/pages/involvements/List'))
const AddNewInvolvement = loadable(() => import('./components/pages/involvements/AddNew'))
const EditInvolvement = loadable(() => import('./components/pages/involvements/Edit'))

// Salary import
const SalaryList = loadable(() => import('./components/pages/salary/List'))
const AddNewSalary = loadable(() => import('./components/pages/salary/AddNew'))
const EditSalary = loadable(() => import('./components/pages/salary/Edit'))

// Skills import
const SkillList = loadable(() => import('./components/pages/skills/List'))
const AddNewSkill = loadable(() => import('./components/pages/skills/AddNew'))
const EditSkill = loadable(() => import('./components/pages/skills/Edit'))

// job types import
const JobTypesList = loadable(() => import('./components/pages/jobtypes/List'))
const AddNewJobType = loadable(() => import('./components/pages/jobtypes/AddNew'))
const EditJobType = loadable(() => import('./components/pages/jobtypes/Edit'))

// content pages import
const PagesList = loadable(() => import('./components/pages/static_pages/List'))
const AddNewPage = loadable(() => import('./components/pages/static_pages/AddNew'))
const EditPage = loadable(() => import('./components/pages/static_pages/Edit'))

// applied jobs import
const AppliedJobList = loadable(() => import('./components/pages/applied-jobs/List'))
// payments import
const PaymentsList = loadable(() => import('./components/pages/payments/List'))

// Subadmin import
const SubadminAdd = loadable(() => import('./components/pages/subadmins/AddNew'))
const SubadminList = loadable(() => import('./components/pages/subadmins/List'))
const SubadminEdit = loadable(() => import('./components/pages/subadmins/Edit'))

let navigate = null

axios.defaults.baseURL = 'http://webmobrildemo.com:9600/';
// axios.defaults.baseURL = 'http://localhost:9600/';
//  Request interceptor
axios.interceptors.request.use(request => {
  let bearertoken = localStorage.getItem('transact_auth_back')
  if (bearertoken !== null) {
    bearertoken = JSON.parse(bearertoken).token
  }
  request.headers['Authorization'] = 'Bearer ' + bearertoken
  return request
})
//  response interceptor
axios.interceptors.response.use(response => {
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
        <Route path="/change-password" element={<ChangePassword />} />
        {/* Categories Start */}
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/addnew" element={<AddNewCategory />} />
        <Route path="/categories/edit/:id" element={<EditCategory />} />
        {/* Categories End */}
       
        {/* Subadmin Start */}
        <Route path="/subadmin" element={<SubadminList />} />
        <Route path="/subadmin/addnew" element={<SubadminAdd />} />
        <Route path="/subadmin/edit/:id" element={<SubadminEdit />} />
        {/* Subadmin End */}
        
        {/* Blogs Start */}
        <Route path="/blogs" element={<BlogsList />} />
        <Route path="/blogs/addnew" element={<AddNewBlog />} />
        <Route path="/blogs/edit/:id" element={<EditBlog />} />
        {/* Blogs End */}

        {/* Experience Start */}
        <Route path="/experience" element={<ExperienceList />} />
        <Route path="/experience/addnew" element={<AddNewExperience />} />
        <Route path="/experience/edit/:id" element={<EditExperience />} />
        {/* Experience End */}
        
        {/* Responsibilities Start */}
        <Route path="/responsibilities" element={<ResponsibilitiesList />} />
        <Route path="/responsibilities/addnew" element={<AddNewResponsibility />} />
        <Route path="/responsibilities/edit/:id" element={<EditResponsibility />} />
        {/* Responsibilities End */}
        
        {/* Involvements Start */}
        <Route path="/involvements" element={<InvolvementList />} />
        <Route path="/involvements/addnew" element={<AddNewInvolvement />} />
        <Route path="/involvements/edit/:id" element={<EditInvolvement />} />
        {/* Involvements End */}

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
       
        {/* job types Start*/}
        <Route path="/job-types" element={<JobTypesList />} />
        <Route path="/job-types/addnew" element={<AddNewJobType />} />
        <Route path="/job-types/edit/:id" element={<EditJobType />} />
        {/* job types End*/}
       
        {/* content pages Start*/}
        <Route path="/content-pages" element={<PagesList />} />
        <Route path="/content-pages/addnew" element={<AddNewPage />} />
        <Route path="/content-pages/edit/:id" element={<EditPage />} />
        {/* content pages End*/}
        
        {/* applied jobs Start*/}
        <Route path="/applied-jobs" element={<AppliedJobList />} />
        {/* applied jobs End*/}
        
        {/* payments Start*/}
        <Route path="/payments" element={<PaymentsList />} />
        {/* payments End*/}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
