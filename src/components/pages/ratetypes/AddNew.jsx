import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddNew() {
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const navigate = useNavigate()
    const validate = values => {
        const errors = {};

        if (!values.title) {
            errors.title = 'Title is required';
        } else if (values.title.length < 3) {
            errors.title = 'Title min legth is 3 characters';
        } else if (values.title.length > 50) {
            errors.title = 'Title max legth is 50 characters';
        }

        

        return errors;
    };
    const formik = useFormik({
        initialValues: {
            title:''
        },
        validate,
        onSubmit: async (values) => {
           
            setDisabledSubmit(true)
            try {
                let res=await axios.post(`admin/ratetypeadd`, values)
                navigate('/rate-types',{state:{message:res.data.message}})
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
                <title>Add rate type</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Add New Rate Type</h6>
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