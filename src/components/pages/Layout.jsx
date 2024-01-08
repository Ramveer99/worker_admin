import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/custom.css'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LayoutPage(props) {
    const [username, setUsername] = useState(null)
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('transact_auth_back'))
        setUserData(user)
        setUsername(user.username)
    }, [username])
    const handleLogout = () => {
        localStorage.removeItem('transact_auth_back')
        navigate('/')
    }
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3   bg-gradient-dark" id="sidenav-main">
                <div className="sidenav-header">
                    <i className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
                    {/* <a className="navbar-brand m-0" href="https://demos.creative-tim.com/material-dashboard/pages/dashboard " target="_blank">
                        <span style={{ color: 'white' }}>Welcome </span><span className="ms-1 font-weight-bold text-white"> {username ? username : ''}</span>
                    </a> */}
                    <Link className="navbar-brand m-0 new-da" to={'/'}>
                        <img src={`${process.env.PUBLIC_URL}/assets/img/final_logo.svg`} alt="" />
                        <span style={{ color: 'white' }}>Welcome </span><span className="ms-1 font-weight-bold text-white"> {username ? username : ''}</span>
                    </Link>
                </div>
                <hr className="horizontal light mt-0 mb-2" />
                <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to='/dashboard' className={`nav-link text-white ${location.pathname.includes('/dashboard') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="material-icons opacity-10">dashboard</i>
                                </div>
                                <span className="nav-link-text ms-1">Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/change-password' className={`nav-link text-white ${location.pathname.includes('/change-password') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="fa fa-user"></i>
                                </div>
                                <span className="nav-link-text ms-1">Profile</span>
                            </Link>
                        </li>

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.country_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/country' className={`nav-link text-white ${location.pathname.includes('/country') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-globe"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Country</span>
                                    </a>
                                </li>
                            ) : ''
                        }
                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.province_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/city' className={`nav-link text-white ${location.pathname.includes('/city') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-globe"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Provinces</span>
                                    </a>
                                </li>
                            ) : ''
                        }
                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.subarea_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/subarea' className={`nav-link text-white ${location.pathname.includes('/subarea') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-globe"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">SubArea</span>
                                    </a>
                                </li>
                            ) : ''
                        }


                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.job_title_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/jobtitle' className={`nav-link text-white ${location.pathname.includes('/jobtitle') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-list"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Job Titles</span>
                                    </a>
                                </li>
                            ) : ''
                        }
                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.category_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/categories' className={`nav-link text-white ${location.pathname.includes('/categories') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-list"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Categories</span>
                                    </a>
                                </li>
                            ) : ''
                        }
                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.advertise_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/advertise' className={`nav-link text-white ${location.pathname.includes('/advertise') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fas fa-ad"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Advertise</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.subadmin_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/subadmin' className={`nav-link text-white ${location.pathname.includes('/subadmin') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-users"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Subadmins</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.user_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/users' className={`nav-link text-white ${location.pathname.includes('/users') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-users"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Users Management</span>
                                    </a>
                                </li>
                            ) : ''
                        }
                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.custom_messages_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/custom-messages' className={`nav-link text-white ${location.pathname.includes('/custom-messages') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fas fa-envelope-open-text"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Custom Messages</span>
                                    </a>
                                </li>
                            ) : ''
                        }
                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.rate_type_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/rate-types' className={`nav-link text-white ${location.pathname.includes('/rate-types') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-dollar"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Rate Type Management</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.experience_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/experience' className={`nav-link text-white ${location.pathname.includes('/experience') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-history"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Experiences</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.responsibility_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/responsibilities' className={`nav-link text-white ${location.pathname.includes('/responsibilities') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-history"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Responsibilities</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.involvement_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/involvements' className={`nav-link text-white ${location.pathname.includes('/involvements') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-history"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Involvements</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.blogs_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/blogs' className={`nav-link text-white ${location.pathname.includes('/blogs') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fab fa-blogger-b"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Blogs</span>
                                    </a>                           </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.communication_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/communication' className={`nav-link text-white ${location.pathname.includes('/communication') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fab fa-blogger-b"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Communication</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.salary_access
                            ) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/salary' className={`nav-link text-white ${location.pathname.includes('/salary') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-money"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Salary Management</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.skills_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/skills' className={`nav-link text-white ${location.pathname.includes('/skills') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-cogs"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Skills Management</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.jobtype_access
                            ) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/job-types' className={`nav-link text-white ${location.pathname.includes('/job-types') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-tasks"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Job Types Management</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.content_management_access
                            ) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/content-pages' className={`nav-link text-white ${location.pathname.includes('/content-pages') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-globe"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Content Management</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.payments_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/payments' className={`nav-link text-white ${location.pathname.includes('/payments') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-credit-card"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Payments</span>
                                    </a>
                                </li>
                            ) : ''
                        }

                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.applied_jobs_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/applied-jobs' className={`nav-link text-white ${location.pathname.includes('/applied-jobs') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-cogs"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Applied Jobs</span>
                                    </a>
                                </li>
                            ) : ''
                        }


                        {
                            (userData && userData.subadmin_data && userData.subadmin_data.rating_request_access) || (userData && !userData.subadmin_data) ? (
                                <li className="nav-item">
                                    <a href='/admin/rating-request' className={`nav-link text-white ${location.pathname.includes('/rating-request') ? "active bg-gradient-primary" : ""}`}>
                                        <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="fa fa-check"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Rating Requests</span>
                                    </a>
                                </li>
                            ) : ''
                        }




                    </ul>
                </div>
            </aside>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
                    <div className="container-fluid py-1 px-3">
                        <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                            <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                                <div className="input-group input-group-outline"></div>
                            </div>
                            <ul className="navbar-nav  justify-content-end">
                                <li className="nav-item px-3 d-flex align-items-center">
                                    <button className='btn bg-gradient-primary' title='Logout' onClick={handleLogout}>
                                        <i className="fa fa-lg fa-power-off fixed-plugin-button-nav cursor-pointer"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid py-4">
                    {props.children}
                    {
                        props.withFooter && (
                            <footer className="footer py-4  ">
                                <div className="container-fluid">
                                    <div className="row align-items-center justify-content-lg-between">
                                        <div className="col-lg-6 mb-lg-0 mb-4">
                                            <div className="copyright text-center text-sm text-muted text-lg-start">
                                                © Transact
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <ul className="nav nav-footer justify-content-center justify-content-lg-end">

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        )
                    }

                </div>
            </main>

        </>
    );
}

export default LayoutPage;