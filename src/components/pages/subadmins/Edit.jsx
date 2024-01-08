import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import * as Yup from 'yup'

LoadingOverlay.propTypes = undefined

function EditCategory() {
    const { id } = useParams()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [rolesData, setRolesData] = useState([])
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({ id: '', name: '', email: '', roles: [] });
    const navigate = useNavigate()

    const getCategoryDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/subadmin_detail?id=${id}`)
            let rolesArr = []
            if (res.data.result.category_access === true) {
                rolesArr.push('category_access')
            }
            if (res.data.result.country_access === true) {
                rolesArr.push('country_access')
            }
            if (res.data.result.province_access === true) {
                rolesArr.push('province_access')
            }
            if (res.data.result.subarea_access === true) {
                rolesArr.push('subarea_access')
            }
            if (res.data.result.job_title_access === true) {
                rolesArr.push('job_title_access')
            }
            if (res.data.result.advertise_access === true) {
                rolesArr.push('advertise_access')
            }
            if (res.data.result.custom_messages_access === true) {
                rolesArr.push('custom_messages_access')
            }
            if (res.data.result.subadmin_access === true) {
                rolesArr.push('subadmin_access')
            }
            if (res.data.result.rate_type_access === true) {
                rolesArr.push('rate_type_access')
            }
            if (res.data.result.communication_access === true) {
                rolesArr.push('communication_access')
            }
            if (res.data.result.rating_request_access === true) {
                rolesArr.push('rating_request_access')
            }
            if (res.data.result.user_access === true) {
                rolesArr.push('user_access')
            }
            if (res.data.result.experience_access === true) {
                rolesArr.push('experience_access')
            }
            if (res.data.result.responsibility_access === true) {
                rolesArr.push('responsibility_access')
            }
            if (res.data.result.involvement_access === true) {
                rolesArr.push('involvement_access')
            }
            if (res.data.result.blogs_access === true) {
                rolesArr.push('blogs_access')
            }
            if (res.data.result.salary_access === true) {
                rolesArr.push('salary_access')
            }
            if (res.data.result.skills_access === true) {
                rolesArr.push('skills_access')
            }
            if (res.data.result.jobtype_access === true) {
                rolesArr.push('jobtype_access')
            }
            if (res.data.result.content_management_access === true) {
                rolesArr.push('content_management_access')
            }
            if (res.data.result.payments_access === true) {
                rolesArr.push('payments_access')
            }
            if (res.data.result.applied_jobs_access === true) {
                rolesArr.push('applied_jobs_access')
            }
            setRolesData(rolesArr)

            setInitialValues({
                id: res.data.result._id,
                name: res.data.result.user_id.name,
                email: res.data.result.user_id.email,
            })
            setLoading(false);
        } catch (errors) {
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
    }, [])

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().required("Email is required").email('Must be a valid email'),
    })
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/subadmin_update`, {
                    id: values.id,
                    name: values.name,
                    email: values.email,
                    roles: rolesData
                })
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
        if (event.target.checked) {
            setRolesData(oldArray => [...oldArray, event.target.value]);
        } else {
            setRolesData(rolesData.filter(item => item !== event.target.value));
        }
    }
    useEffect(() => {
        getCategoryDetail()
    }, [getCategoryDetail])
    return (
        <>
            <Helmet>
                <title>Edit Subadmin</title>
            </Helmet>

            <LayoutPage>
                <div className="row">
                    <LoadingOverlay
                        active={loading}
                        spinner
                        text="Loading..."
                    >
                        <div className="col-12">
                            <div className="card my-4">
                                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                    <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                        <h6 className="text-white text-capitalize ps-3">Edit Subadmin</h6>
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
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'category_access'}
                                                    checked={rolesData.indexOf('category_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Category Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'country_access'}
                                                    checked={rolesData.indexOf('country_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Country Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'province_access'}
                                                    checked={rolesData.indexOf('province_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Province Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'subarea_access'}
                                                    checked={rolesData.indexOf('subarea_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Subarea Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'job_title_access'}
                                                    checked={rolesData.indexOf('job_title_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Jobtitle Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'advertise_access'}
                                                    checked={rolesData.indexOf('advertise_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Advertise Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'custom_messages_access'}
                                                    checked={rolesData.indexOf('custom_messages_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Custom Messages Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'rate_type_access'}
                                                    checked={rolesData.indexOf('rate_type_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Rate Type Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'communication_access'}
                                                    checked={rolesData.indexOf('communication_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Communication Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'rating_request_access'}
                                                    checked={rolesData.indexOf('rating_request_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                />&nbsp;Rating Request Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'subadmin_access'}
                                                    checked={rolesData.indexOf('subadmin_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Subadmin Access
                                                </label>
                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'user_access'}
                                                    checked={rolesData.indexOf('user_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Users Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'experience_access'}
                                                    checked={rolesData.indexOf('experience_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Experience Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'responsibility_access'}
                                                    checked={rolesData.indexOf('responsibility_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Responsibilities Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'involvement_access'}
                                                    checked={rolesData.indexOf('involvement_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Involvement Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'blogs_access'}
                                                    checked={rolesData.indexOf('blogs_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Blogs Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'salary_access'}
                                                    checked={rolesData.indexOf('salary_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Salary Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'skills_access'}
                                                    checked={rolesData.indexOf('skills_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Skills Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'jobtype_access'}
                                                    checked={rolesData.indexOf('jobtype_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Job Types Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'content_management_access'}
                                                    checked={rolesData.indexOf('content_management_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Content Management
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    value={'payments_access'}
                                                    checked={rolesData.indexOf('payments_access') !== -1 ? true : false}
                                                    onChange={(e) => handlePermissionChange(e)}
                                                    name='role'
                                                />&nbsp;Payments Access
                                                </label>

                                                &nbsp;&nbsp;
                                                <label> <input
                                                    type="checkbox"
                                                    name='role'
                                                    value={'applied_jobs_access'}
                                                    checked={rolesData.indexOf('applied_jobs_access') !== -1 ? true : false}
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
                    </LoadingOverlay>
                </div>
            </LayoutPage>
        </>
    );
}

export default EditCategory;