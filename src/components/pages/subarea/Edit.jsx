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

function EditCity() {
    const { id } = useParams()
    const [citiesData, setCitiesData] = useState()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({ id: '', subarea_name: '', city_id: '' });
    const navigate = useNavigate()

    const getSubareaDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/subarea?id=${id}`)
            console.log(res);
            setInitialValues({ id: res.data.result.city._id, subarea_name: res.data.result.city.subarea_name, city_id: res.data.result.city.city_id._id })
            setCitiesData(res.data.result.cities)
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

        if (!values.subarea_name) {
            errors.subarea_name = 'Subarea name is required';
        } else if (values.subarea_name.length < 3) {
            errors.subarea_name = 'Subarea name min length is 3 characters';
        } else if (values.subarea_name.length > 50) {
            errors.subarea_name = 'Subarea name max length is 50 characters';
        }
        if (!values.city_id) {
            errors.city_id = 'Please choose a province';
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
                let res = await axios.post(`admin/subareaupdate`, values)
                navigate('/subarea', { state: { message: res.data.message } })
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
        getSubareaDetail()
    }, [getSubareaDetail])
    return (
        <>
            <Helmet>
                <title>Edit Subarea</title>
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
                                        <h6 className="text-white text-capitalize ps-3">Edit Subarea</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='subarea_name'
                                                    name='subarea_name'
                                                    className="form-control"
                                                    placeholder='Subarea Name'
                                                    value={formik.values.subarea_name || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.subarea_name ? <div className='text-danger'>{formik.errors.subarea_name}</div> : null}

                                            <div className="input-group input-group-outline mb-3">
                                                <select
                                                    type="text"
                                                    id='city_id'
                                                    name='city_id'
                                                    className="form-control"
                                                    autoComplete='off'
                                                    value={formik.values.city_id || ''}
                                                    onChange={formik.handleChange}
                                                >
                                                    <option value="">--select--</option>
                                                    {
                                                        citiesData && citiesData.map((item) => {
                                                            return (
                                                                <option key={item._id} value={item._id} >{item.city_name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            {formik.errors.city_id ? <div className='text-danger'>{formik.errors.city_id}</div> : null}
                                            <div className="text-center">
                                                <button type="button" onClick={() => navigate('/subarea')} className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    Cancel
                                                </button>&nbsp;&nbsp;
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit
                                                            ? (
                                                                <div>
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    <span className="sr-only"></span>  {disabledSubmit ? 'Updating' : 'Redirecting'}
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

export default EditCity;