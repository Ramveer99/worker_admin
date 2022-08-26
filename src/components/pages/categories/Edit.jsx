import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
LoadingOverlay.propTypes = undefined

function EditCategory() {
    const { id } = useParams()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [redirecting, setRedirecting] = useState(false)
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({ id: '', category_name: '', category_desc: '', categoryfile: '' });
    const navigate = useNavigate()

    const getCategoryDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/category?id=${id}`)
            setCategoryData(res.data.result)
            setInitialValues({ id: res.data.result._id, category_name: res.data.result.category_name, category_desc: res.data.result.category_desc })
            // formik.initialValues.category_name = res.data.result.category_name
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

    const validate = values => {
        const errors = {};

        if (!values.category_name) {
            errors.category_name = 'Category name is required';
        } else if (values.category_name.length < 3) {
            errors.category_name = 'Category name min length is 3 characters';
        } else if (values.category_name.length > 50) {
            errors.category_name = 'Category name max length is 50 characters';
        }
        if (!values.category_desc) {
            errors.category_desc = 'Description is required';
        } else if (values.category_desc.length < 20) {
            errors.category_desc = 'Description min length is 20 characters';
        } else if (values.category_desc.length > 500) {
            errors.category_desc = 'Description max length is 500 characters';
        }

        return errors;
    };
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validate,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let formData = new FormData()
                formData.append("id", values.id)
                formData.append("category_name", values.category_name)
                formData.append("category_desc", values.category_desc)
                formData.append("categoryfile", values.categoryfile)

                let res = await axios.post(`admin/categoryupdate`, formData)

                navigate('/categories', { state: { message: res.data.message } })
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

    useEffect(() => {
        getCategoryDetail()
    }, [getCategoryDetail])
    return (
        <>
            <Helmet>
                <title>Edit Category</title>
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
                                        <h6 className="text-white text-capitalize ps-3">Edit Category</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='category_name'
                                                    name='category_name'
                                                    className="form-control"
                                                    placeholder='Category Name'
                                                    value={formik.values.category_name}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.category_name ? <div className='text-danger'>{formik.errors.category_name}</div> : null}
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="file"
                                                    id='categoryfile'
                                                    name='categoryfile'
                                                    className="form-control"
                                                    placeholder='Category Image'
                                                    onChange={(event) => {
                                                        formik.setFieldValue("categoryfile", event.target.files[0]);
                                                    }}
                                                />
                                            </div>
                                            <div className="input-group input-group-outline mb-3">
                                                <textarea
                                                    className="form-control"
                                                    placeholder='Description'
                                                    id='category_desc'
                                                    name='category_desc'
                                                    value={formik.values.category_desc}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.category_desc ? <div className='text-danger'>{formik.errors.category_desc}</div> : null}
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit || redirecting ? (
                                                            <div>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                <span className="sr-only"></span>  {disabledSubmit && !redirecting ? 'Updating' : 'Redirecting'}
                                                            </div>
                                                        ) : 'Update'
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