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

function Edit() {
    const { id } = useParams()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({ id: '', title: '', years: '' });
    const navigate = useNavigate()

    const experienceDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/experience?id=${id}`)
            setInitialValues({ id: res.data.result._id, title: res.data.result.title, years: res.data.result.years })
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

    // const validate = values => {
    //     const errors = {};

    //     if (!values.title) {
    //         errors.title = 'Experience title is required';
    //     } else if (values.title.length < 3) {
    //         errors.title = 'Experience title min legth is 3 characters';
    //     } else if (values.title.length > 50) {
    //         errors.title = 'Experience title max legth is 50 characters';
    //     }

    //     return errors;
    // };

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required").min(3, 'Must be atleast 3 caracters long').max(50, 'Must not exceeds 50 characters'),
        years: Yup.string().required("Years are required").matches(/^[0-9]+$/, 'Must be only digits'),

    })
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/experienceupdate/${values.id}`, { title: values.title, years: values.years })

                navigate('/experience', { state: { message: res.data.message } })
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
                setDisabledSubmit(false)
            }
        },
    });

    useEffect(() => {
        experienceDetail()
    }, [experienceDetail])
    return (
        <>
            <Helmet>
                <title>Edit Experience</title>
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
                                        <h6 className="text-white text-capitalize ps-3">Edit Experience</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='title'
                                                    name='title'
                                                    className="form-control"
                                                    placeholder='Title'
                                                    value={formik.values.title}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.title ? <div className='text-danger'>{formik.errors.title}</div> : null}
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='years'
                                                    name='years'
                                                    className="form-control"
                                                    placeholder='Years'
                                                    value={formik.values.years}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.years ? <div className='text-danger'>{formik.errors.years}</div> : null}
                                            <div className="text-center">
                                                <button type="button" onClick={() => navigate('/experience')} className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    Cancel
                                                </button>&nbsp;&nbsp;
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit ? (
                                                            <div>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                <span className="sr-only"></span>  {disabledSubmit ? 'Updating' : ''}
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

export default Edit;