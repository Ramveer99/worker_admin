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

function ApproveRefund() {
    const { id } = useParams()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({ id: id, refund_note: '' });
    const navigate = useNavigate()

    const validate = values => {
        const errors = {};

        if (!values.refund_note) {
            errors.refund_note = 'Please enter note';
        }
        return errors;
    };
    const formik = useFormik({
        initialValues: initialValues,
        validate,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let formData = new FormData()
                console.log();
                // formData.append("id", values.id)
                // formData.append("refund_note", values.refund_note)
                let res = await axios.post(`admin/approve-refund`, values)
                navigate('/payments', { state: { message: res.data.message } })
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
                <title>Approve Payment</title>
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
                                        <h6 className="text-white text-capitalize ps-3"> Accepting the refund</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3">
                                                {/* <input
                                                    type="file"
                                                    id='categoryfile'
                                                    name='categoryfile'
                                                    className="form-control"
                                                    placeholder='Category Image'
                                                    onChange={(event) => {
                                                        formik.setFieldValue("approval_file", event.target.files[0]);
                                                    }}
                                                /> */}
                                                <textarea
                                                    id='refund_note'
                                                    name='refund_note'
                                                    className="form-control"
                                                    placeholder='Note'
                                                    value={formik.values.refund_note || ''}
                                                    onChange={formik.handleChange} />
                                            </div>
                                            {formik.errors.refund_note ? <div className='text-danger'>{formik.errors.refund_note}</div> : null}

                                            <div className="text-center">
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit ? (
                                                            <div>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                <span className="sr-only"></span>  {disabledSubmit ? 'Approving' : ''}
                                                            </div>
                                                        ) : 'Approve'
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

export default ApproveRefund;