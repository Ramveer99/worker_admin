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
        title: Yup.string().required("Title is required").min(3, 'Must be atleast 3 caracters long').max(50, 'Must not exceeds 50 characters'),
        years: Yup.string().required("Years are required").matches(/^[0-9]+$/, 'Must be only digits'),

    })

    const formik = useFormik({
        initialValues: {
            title: '',
            years: '',
        },
        validationSchema,
        onSubmit: async (values) => {

            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/experienceadd`, values)
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
    return (
        <>
            <Helmet>
                <title>Add experience</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Add New Experience</h6>
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
                                                value={formik.values.title || ''}
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
                                                value={formik.values.years || ''}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.errors.years ? <div className='text-danger'>{formik.errors.years}</div> : null}

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