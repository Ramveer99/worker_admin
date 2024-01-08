import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'

function AddNew() {
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const navigate = useNavigate()

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().required("Email is required").email('Must be a valid email'),
        password: Yup.string().required("Password is required")
            .min(8, 'Password must be 8 characters long')
            .max(15, 'Password must not exceed 15 characters long')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
                "Password must contain one uppercase, one lowercase, one number and one special character"
            ),
    })
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            roles: []
        },
        validationSchema,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/subadmin_add`, values)
                navigate('/subadmin', { state: { message: res.data.message } })
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
    const handlePermissionChange = (event) => {
        console.log(event.target.checked, event.target.value);
        if (event.target.checked) {
            formik.values.roles.push(event.target.value)
        } else {
            let index = formik.values.roles.indexOf(event.target.value);
            formik.values.roles.splice(index, 1)
        }
    }
    return (
        <>
            <Helmet>
                <title>Add Subadmin</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Add New Subadmin</h6>
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2">
                                <div className="p-4">
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="input-group input-group-outline mb-3">
                                            <input
                                                type="text"
                                                id='name'
                                                name='name'
                                                className="form-control"
                                                placeholder='Name'
                                                value={formik.values.name || ''}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.errors.name ? <div className='text-danger'>{formik.errors.name}</div> : null}
                                        <div className="input-group input-group-outline mb-3">
                                            <input
                                                type="text"
                                                id='email'
                                                name='email'
                                                className="form-control"
                                                placeholder='Email'
                                                value={formik.values.email || ''}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.errors.email ? <div className='text-danger'>{formik.errors.email}</div> : null}

                                        <div className="input-group input-group-outline mb-3">
                                            <input
                                                type="password"
                                                id='password'
                                                name='password'
                                                className="form-control"
                                                placeholder='Password'
                                                value={formik.values.password || ''}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.errors.password ? <div className='text-danger'>{formik.errors.password}</div> : null}


                                        <div className="input-group input-group-outline mb-3">
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'category_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Category Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'country_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Country Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'province_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Province Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'subarea_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Subarea Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'job_title_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Jobtitle Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'advertise_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Advertise Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'custom_messages_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Custom Messages Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'rate_type_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Rate Type Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'communication_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Communication Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'rating_request_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Rating Request Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'subadmin_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Subadmin Access
                                            </label>
                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'user_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Users Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'experience_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Experience Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'responsibility_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Responsibilities Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'involvement_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Involvement Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'blogs_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Blogs Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'salary_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Salary Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'skills_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Skills Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'jobtype_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Job Types Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'content_management_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Content Management
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                value={'payments_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                                name='role'
                                            />&nbsp;Payments Access
                                            </label>

                                            &nbsp;&nbsp;
                                            <label> <input
                                                type="checkbox"
                                                name='role'
                                                value={'applied_jobs_access'}
                                                onChange={(e) => handlePermissionChange(e)}
                                            />&nbsp;Applied Jobs Access
                                            </label>
                                        </div>

                                        <div className="text-center">
                                            <button type="button" onClick={() => navigate('/subadmin')} className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                Cancel
                                            </button>&nbsp;&nbsp;
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