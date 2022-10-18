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
    const [initialValues, setInitialValues] = useState({ id: '', name: '', email: '',mobile:'' });
    const navigate = useNavigate()

    const getCategoryDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/user_detail?id=${id}`)
            setInitialValues({
                id: res.data.result._id,
                name: res.data.result.name,
                email: res.data.result.email,
                mobile: res.data.result.mobile,
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
    }, [id])

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().required("Email is required").email('Must be a valid email'),
        mobile: Yup.string().required("Mobile number is required").matches(/^[0-9]+$/, "Mobile number must be only digits"),
    })
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/user_update`, {
                    id: values.id,
                    name: values.name,
                    email: values.email,
                    mobile: values.mobile
                })
                navigate('/users', { state: { message: res.data.message } })
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
                <title>Edit User</title>
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
                                        <h6 className="text-white text-capitalize ps-3">Edit User</h6>
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
                                                    type="text"
                                                    id='mobile'
                                                    name='mobile'
                                                    className="form-control"
                                                    placeholder='Mobile'
                                                    value={formik.values.mobile || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.mobile ? <div className='text-danger'>{formik.errors.mobile}</div> : null}

                                            <div className="text-center">
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit ? (
                                                            <div>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                <span className="sr-only"></span>  Updating
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