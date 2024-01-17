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
    const [countriesData, setCountriesData] = useState()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    // const [cityData, setCityData] = useState([])
    // const [redirecting, setRedirecting] = useState(false)
    const [loading, setLoading] = useState(false);
    // const [initialValues, setInitialValues] = useState({ id: '', nationality_name: '', category_desc: '', categoryfile: '' });
    const [initialValues, setInitialValues] = useState({ id: '', city_name: '', country_id: '' });
    const navigate = useNavigate()

    const getCityDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/city?id=${id}`)
            console.log(res);
            setInitialValues({ id: res.data.result.city._id, city_name: res.data.result.city.city_name, country_id: res.data.result.city.country_id._id })
            setCountriesData(res.data.result.countries)
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

        if (!values.city_name) {
            errors.city_name = 'Province name is required';
        } else if (values.city_name.length < 3) {
            errors.city_name = 'Province name min length is 3 characters';
        } else if (values.city_name.length > 50) {
            errors.city_name = 'Province name max length is 50 characters';
        }
        if (!values.country_id) {
            errors.country_id = 'Please choose a country';
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
                console.log('=============>', values);
                let res = await axios.post(`admin/cityupdate`, values)
                navigate('/city', { state: { message: res.data.message } })
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
        getCityDetail()
    }, [getCityDetail])
    return (
        <>
            <Helmet>
                <title>Edit Province</title>
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
                                        <h6 className="text-white text-capitalize ps-3">Edit Province</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='city_name'
                                                    name='city_name'
                                                    className="form-control"
                                                    placeholder='Province Name'
                                                    value={formik.values.city_name}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.city_name ? <div className='text-danger'>{formik.errors.city_name}</div> : null}

                                            <div className="input-group input-group-outline mb-3">
                                                <select
                                                    type="text"
                                                    id='country_id'
                                                    name='country_id'
                                                    className="form-control"
                                                    autoComplete='off'
                                                    value={formik.values.country_id || ''}
                                                    onChange={formik.handleChange}
                                                >
                                                    <option value="">--select--</option>
                                                    {
                                                        countriesData && countriesData.map((item) => {
                                                            return (
                                                                <option key={item._id} value={item._id} >{item.country_name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            {formik.errors.country_id ? <div className='text-danger'>{formik.errors.country_id}</div> : null}
                                            <div className="text-center">
                                                <button type="button" onClick={() => navigate('/city')} className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    Cancel
                                                </button>&nbsp;&nbsp;
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit
                                                            //  || redirecting 
                                                            ? (
                                                                <div>
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    {/* <span className="sr-only"></span>  {disabledSubmit && !redirecting ? 'Updating' : 'Redirecting'} */}
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