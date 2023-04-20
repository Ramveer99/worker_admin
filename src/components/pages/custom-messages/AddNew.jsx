import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import LoadingOverlay from 'react-loading-overlay';
LoadingOverlay.propTypes = undefined

function AddNew() {
    const [usersData, setUsersData] = useState([])
    const [loading, setLoading] = useState(false)
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [initialValues, setInitialValues] = useState({
        job_success_message: '',
        job_reject_message: '',
    });
    const getUserList = useCallback(async () => {
        setLoading(true);
        let res = await axios.get('/admin/get-custom-messages')
        setUsersData(res.data.result.message_data)

        setInitialValues({
            job_success_message: res.data.result.message_data ? res.data.result.message_data.job_success_message : '',
            job_reject_message: res.data.result.message_data ? res.data.result.message_data.job_reject_message : '',
        })
        setLoading(false);
    }, [])

    useEffect(() => {
        getUserList()
    }, [getUserList])

    const validationSchema = Yup.object({
        job_success_message: Yup.string().required("Please enter success message"),
        job_reject_message: Yup.string().required("Please enter reject message")
    })
    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/custom-message-update`, values)
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
                setDisabledSubmit(false)
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
    return (
        <>
            <Helmet>
                <title>Manage Custom Messages</title>
            </Helmet>
            <LayoutPage>
                <LoadingOverlay
                    active={loading}
                    spinner
                    text="Loading..."
                >
                    <div className="row">

                        <div className="col-12">
                            <div className="card my-4">
                                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                    <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                        <h6 className="text-white text-capitalize ps-3">Custom Messages</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='job_success_message'
                                                    name='job_success_message'
                                                    className="form-control"
                                                    placeholder='Success Message'
                                                    value={formik.values.job_success_message || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.job_success_message ? <div className='text-danger'>{formik.errors.job_success_message}</div> : null}

                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='job_reject_message'
                                                    name='job_reject_message'
                                                    className="form-control"
                                                    placeholder='Reject Message'
                                                    value={formik.values.job_reject_message || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.job_reject_message ? <div className='text-danger'>{formik.errors.job_reject_message}</div> : null}

                                            <div className="text-center">
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit ? (
                                                            <div>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                <span className="sr-only"></span>  Updating...
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
                    </div>
                </LoadingOverlay>
            </LayoutPage>
        </>
    );
}

export default AddNew;