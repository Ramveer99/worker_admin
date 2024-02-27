import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function AddNew() {

    const [countriesData, setCountriesData] = useState()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    // const [initialValues, setInitialValues] = useState({ category_name: '', category_desc: '', categoryfile: '' })
    // const [initialValues, setInitialValues] = useState({ nationality_name: ''})
    const navigate = useNavigate()

    // const handleFileChange = event => {
    //     console.log(event.target.files[0]);
    // }



    const getCountriesList = async () => {
        let res = await axios.get('/admin/getcountries')
        console.log(res.data.countries);
        setCountriesData(res.data.countries)
    }


    useEffect(() => {
        getCountriesList()
    }, [])



    const validate = values => {
        const errors = {};

        if (!values.city_name) {
            errors.city_name = 'City name is required';
        } else if (values.city_name.length < 3) {
            errors.city_name = 'City name min length is 3 characters';
        } else if (values.city_name.length > 50) {
            errors.city_name = 'City name max length is 50 characters';
        }
        if (!values.country_id) {
            errors.country_id = 'Please choose a country';
        }
        // if (!values.categoryfile) {
        //     errors.categoryfile = 'Category image is required';
        // }

        // if (!values.category_desc) {
        //     errors.category_desc = 'Description is required';
        // } else if (values.category_desc.length < 20) {
        //     errors.category_desc = 'Description min length is 20 characters';
        // } else if (values.category_desc.length > 500) {
        //     errors.category_desc = 'Description max length is 500 characters';
        // }

        return errors;
    };
    const formik = useFormik({
        initialValues: { city_name: '', country_id: '' },
        validate,
        onSubmit: async (values) => {
            console.log('formmmmmmmmmmmmmmmmmmmmmmmm', values);
            try {
                setDisabledSubmit(true)
                let res = await axios.post(`admin/cityadd`, values)
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
    return (
        <>
            <Helmet>
                <title>Add City</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Add New City</h6>
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
                                                autoComplete='off'
                                                placeholder='City Name'
                                                value={formik.values.city_name || ''}
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
                                                            <option key={item._id} value={item._id}>{item.country_name}</option>
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