import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../pages/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup'
import '../styles/Login.css'

function AddNew() {
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [disabledEmailSubmit, setDisabledEmailSubmit] = useState(false)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const validationSchema = Yup.object({
        old_password: Yup.string().required("Old password is required"),
        new_password: Yup.string().required("New password is required")
            .min(8, 'New password must be 8 characters long')
            .max(15, 'New password must not exceed 15 characters long')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
                "New password must contain one uppercase, one lowercase, one number and one special character"
            ),
        confirm_password: Yup.string().required("Confirm password is required").oneOf([Yup.ref('new_password'), null], 'New password and confirm password must match'),
    })
    const validationSchemaEmail = Yup.object({
        email: Yup.string().required('Email is required').email("Email must be a valid email"),
    })
    // const logUserEmail = JSON.parse(localStorage.getItem('transact_auth_back')).email
    // console.log(logUserEmail);
    const formikEmail = useFormik({
        initialValues: {
            email: JSON.parse(localStorage.getItem('transact_auth_back')).email
        },
        validationSchema: validationSchemaEmail,
        onSubmit: async (values) => {
            setDisabledEmailSubmit(true)
            try {
                let user = JSON.parse(localStorage.getItem('transact_auth_back'))
                user.email = values.email
                localStorage.setItem('transact_auth_back', JSON.stringify(user))
                let res = await axios.post(`admin/change-password`, { only_email: true, email: values.email })
                setDisabledEmailSubmit(false)
                toast(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'success'
                });
            } catch (errors) {
                if (errors.response.data.error) {
                    toast(errors.response.data.error.message, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        type: 'error'
                    });
                } else {
                    toast(errors.response.data.message, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        type: 'error'
                    });
                }
                setDisabledEmailSubmit(false)
            }
        },
    });
    const formik = useFormik({
        initialValues: {
            old_password: '',
            new_password: '',
            confirm_password: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/change-password`, values)
                resetForm()
                setDisabledSubmit(false)
                toast(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: 'success'
                });
            } catch (errors) {
                if (errors.response.data.error) {
                    toast(errors.response.data.error.message, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        type: 'error'
                    });
                } else {
                    toast(errors.response.data.message, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        type: 'error'
                    });
                }

                setDisabledSubmit(false)
            }
        },
    });
    const showhidePassword = () => {
        setShowOldPassword(!showOldPassword)
    }

    const showhideNewPassword = () => {
        setShowNewPassword(!showNewPassword)
    }
    const showhideConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
    return (
        <>
            <Helmet>
                <title>Update Profile</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Update Profile</h6>
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2">
                                <div className="p-4">
                                    <form onSubmit={formikEmail.handleSubmit}>
                                        <div className="input-group input-group-outline mb-3">
                                            <input
                                                type="text"
                                                id='email'
                                                name='email'
                                                className="form-control"
                                                placeholder='Email Address'
                                                readOnly
                                                value={formikEmail.values.email || ''}
                                                onChange={formikEmail.handleChange}
                                            />
                                        </div>
                                        {formikEmail.errors.email ? <div className='text-danger'>{formikEmail.errors.email}</div> : null}
                                        {/* <div className="text-left">
                                            <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledEmailSubmit}>
                                                {
                                                    disabledEmailSubmit ? (
                                                        <div>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            <span className="sr-only"></span>  Updating
                                                        </div>
                                                    ) : 'Update'
                                                }
                                            </button>
                                        </div> */}
                                    </form>
                                    <br />
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="input-group input-group-outline mb-3 pas-eye">
                                            <input
                                                type={showOldPassword ? "text" : "password"}
                                                id='old_password'
                                                name='old_password'
                                                className="form-control"
                                                placeholder='Old Password'
                                                value={formik.values.old_password || ''}
                                                onChange={formik.handleChange}
                                            />
                                            <i className={showOldPassword ? "fas fa-eye" : "fas fa-eye-slash"} onClick={() => showhidePassword()}></i>

                                        </div>
                                        {formik.errors.old_password ? <div className='text-danger'>{formik.errors.old_password}</div> : null}
                                        <div className="input-group input-group-outline mb-3 pas-eye">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                id='new_password'
                                                name='new_password'
                                                className="form-control"
                                                placeholder='New Password'
                                                value={formik.values.new_password || ''}
                                                onChange={formik.handleChange}
                                            />
                                            <i className={showNewPassword ? "fas fa-eye" : "fas fa-eye-slash"} onClick={() => showhideNewPassword()}></i>

                                        </div>
                                        {formik.errors.new_password ? <div className='text-danger'>{formik.errors.new_password}</div> : null}
                                        <div className="input-group input-group-outline mb-3 pas-eye">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id='confirm_password'
                                                name='confirm_password'
                                                className="form-control"
                                                placeholder='Confirm Password'
                                                value={formik.values.confirm_password || ''}
                                                onChange={formik.handleChange}
                                            />
                                            <i className={showConfirmPassword ? "fas fa-eye" : "fas fa-eye-slash"} onClick={() => showhideConfirmPassword()}></i>

                                        </div>
                                        {formik.errors.confirm_password ? <div className='text-danger'>{formik.errors.confirm_password}</div> : null}
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                {
                                                    disabledSubmit ? (
                                                        <div>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            <span className="sr-only"></span>  Submitting
                                                        </div>
                                                    ) : 'Submit'
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutPage>
        </>
    );
}

export default AddNew;