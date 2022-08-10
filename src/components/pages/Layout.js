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
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('transact_auth_back'))
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
                    <Link className="navbar-brand m-0" to={'/'}>
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
                            <Link to='/categories' className={`nav-link text-white ${location.pathname.includes('/categories') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="fa fa-list"></i>
                                </div>
                                <span className="nav-link-text ms-1">Categories Management</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/users' className={`nav-link text-white ${location.pathname.includes('/users') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="fa fa-users"></i>
                                </div>
                                <span className="nav-link-text ms-1">Users Management</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/experience' className={`nav-link text-white ${location.pathname.includes('/experience') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="fa fa-history"></i>
                                </div>
                                <span className="nav-link-text ms-1">Experience Management</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/salary' className={`nav-link text-white ${location.pathname.includes('/salary') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="fa fa-money"></i>
                                </div>
                                <span className="nav-link-text ms-1">Salary Management</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/skills' className={`nav-link text-white ${location.pathname.includes('/skills') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="fa fa-cogs"></i>
                                </div>
                                <span className="nav-link-text ms-1">Skills Management</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/job-types' className={`nav-link text-white ${location.pathname.includes('/job-types') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="fa fa-tasks"></i>
                                </div>
                                <span className="nav-link-text ms-1">Job Types Management</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/applied-jobs' className={`nav-link text-white ${location.pathname.includes('/applied-jobs') ? "active bg-gradient-primary" : ""}`}>
                                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i className="fa fa-cogs"></i>
                                </div>
                                <span className="nav-link-text ms-1">Applied Jobs</span>
                            </Link>
                        </li>

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