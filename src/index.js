import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import axios from 'axios';
import loadable from '@loadable/component';
import { useNavigate } from 'react-router-dom';
// import LayoutPage from './components/pages/shared/Layout';

const NotFound = loadable(() => import('./components/Notfound'))
const Login = loadable(() => import('./components/auth/Login'))
const ForgotPassword = loadable(() => import('./components/auth/ForgotPassword'))
const VerifyForgotPassword = loadable(() => import('./components/auth/VerifyForgotOtp'))
const ResetPassword = loadable(() => import('./components/auth/ResetPassword'))
const Dashboard = loadable(() => import('./components/pages/Dashboard'))

//  users import
const Users = loadable(() => import('./components/pages/users/Users'))
const EditUser = loadable(() => import('./components/pages/users/Edit'))
const AddNewUser = loadable(() => import('./components/pages/users/AddNew'))
const ChangePassword = loadable(() => import('./components/auth/ChangePassword'))
// Categories import
const CategoriesList = loadable(() => import('./components/pages/categories/List'))
const AddNewCategory = loadable(() => import('./components/pages/categories/AddNew'))
const EditCategory = loadable(() => import('./components/pages/categories/Edit'))

// Categories import
const NationalityList = loadable(() => import('./components/pages/nationality/List'))
const AddNewNationality = loadable(() => import('./components/pages/nationality/AddNew'))
const EditNationality = loadable(() => import('./components/pages/nationality/Edit'))

// Countries import
const CountryList = loadable(() => import('./components/pages/country/List'))
const AddNewCountry = loadable(() => import('./components/pages/country/AddNew'))
const EditCountry = loadable(() => import('./components/pages/country/Edit'))


// City import
const CityList = loadable(() => import('./components/pages/city/List'))
const AddNewCity = loadable(() => import('./components/pages/city/AddNew'))
const EditCity = loadable(() => import('./components/pages/city/Edit'))



// SubArea import
const SubAreaList = loadable(() => import('./components/pages/subarea/List'))
const AddNewSubArea = loadable(() => import('./components/pages/subarea/AddNew'))
const EditSubArea = loadable(() => import('./components/pages/subarea/Edit'))




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
const ApprovePayment = loadable(() => import('./components/pages/payments/ApprovePayment'))

// Subadmin import
const SubadminAdd = loadable(() => import('./components/pages/subadmins/AddNew'))
const SubadminList = loadable(() => import('./components/pages/subadmins/List'))
const SubadminEdit = loadable(() => import('./components/pages/subadmins/Edit'))

// Communication import
const SendNotification = loadable(() => import('./components/pages/communication/AddNew'))
const CommunicationList = loadable(() => import('./components/pages/communication/List'))
// const SubadminEdit = loadable(() => import('./components/pages/subadmins/Edit'))

let navigate = null

axios.defaults.baseURL = 'https://webmobrildemo.com/obediant/';
// axios.defaults.baseURL = 'http://localhost:9600/';
// axios.defaults.baseURL = 'http://3.211.103.52/';
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
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Users start */}
        <Route path="/users" element={<Users />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/users/addnew" element={<AddNewUser />} />
        {/* Users ends */}


        {/* nationality Start */}
        <Route path="/nationality" element={<NationalityList />} />
        <Route path="/nationality/addnew" element={<AddNewNationality />} />
        <Route path="/nationality/edit/:id" element={<EditNationality />} />

        {/* country Start */}
        <Route path="/country" element={<CountryList />} />
        <Route path="/country/addnew" element={<AddNewCountry />} />
        <Route path="/country/edit/:id" element={<EditCountry />} />

        
        {/* city Start */}
        <Route path="/city" element={<CityList />} />
        <Route path="/city/addnew" element={<AddNewCity />} />
        <Route path="/city/edit/:id" element={<EditCity />} />

        
        {/* city Start */}
        <Route path="/subarea" element={<SubAreaList />} />
        <Route path="/subarea/addnew" element={<AddNewSubArea />} />
        <Route path="/subarea/edit/:id" element={<EditSubArea />} />
        
        
        {/* Categories Start */}
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/addnew" element={<AddNewCategory />} />
        <Route path="/categories/edit/:id" element={<EditCategory />} />
        
      

        {/* <Route path="/categories" element={<LayoutPage />} >
          <Route index element={<CategoriesList />} />
          <Route path="addnew" element={<AddNewCategory />} />
          <Route path="edit/:id" element={<EditCategory />} />
        </Route> */}
        {/* Categories End */}

        {/* Subadmin Start */}
        <Route path="/subadmin" element={<SubadminList />} />
        <Route path="/subadmin/addnew" element={<SubadminAdd />} />
        <Route path="/subadmin/edit/:id" element={<SubadminEdit />} />
        {/* Subadmin End */}

        {/* communication Start */}
        <Route path="/communication" element={<CommunicationList />} />
        <Route path="/communication/addnew" element={<SendNotification />} />
        <Route path="/communication/edit/:id" element={<SubadminEdit />} />
        {/* communication End */}

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
        <Route path="/payments/approve/:id" element={<ApprovePayment />} />
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
