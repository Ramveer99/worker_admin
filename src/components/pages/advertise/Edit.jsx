import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import * as Yup from 'yup'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import dayjs from 'dayjs';
import './style.css'
LoadingOverlay.propTypes = undefined

function EditCategory() {
    const { id } = useParams()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [usersData, setUsersData] = useState([])
    const [loading, setLoading] = useState(false);
    const [valueStart, setValueStart] = useState(new Date());
    const [valueEnd, setValueEnd] = useState(null);
    const [minDateTimeValueStart, setMinDateTimeValueStart] = useState(dayjs(moment().format('YYYY-MM-DDTHH:mm')));
    const [maxDateTimeValueStart, setMaxDateTimeValueStart] = useState(null);
    const [minDateTimeValueEnd, setMinDateTimeValueEnd] = useState(dayjs(moment().format('YYYY-MM-DDTHH:mm')));
    const [initialValues, setInitialValues] = useState({
        id: '',
        user_id: '',
        banner_link: '',
        banner_image: '',
        start_date: '',
        end_date: '',
    });
    const navigate = useNavigate()

    const getCategoryDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/advertisement/detail?id=${id}`)
            setCategoryData(res.data.result.ad_data)
            setUsersData(res.data.result.user_data)
            // console.log(res.data.result);
            setInitialValues({
                id: res.data.result.ad_data._id,
                user_id: res.data.result.ad_data.user_id,
                start_date: res.data.result.ad_data.start_time,
                end_date: res.data.result.ad_data.end_time,
                banner_link: res.data.result.ad_data.banner_link
            })
            setValueStart(res.data.result.ad_data.start_time)
            setValueEnd(res.data.result.ad_data.end_time)
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

    const validationSchema = Yup.object({
        user_id: Yup.string().required("Please choose a user"),
        banner_link: Yup.string().required("Banner link is required").matches(/^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm, 'Please enter valida url'),
    })
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let formData = new FormData()
                formData.append("id", values.id)
                formData.append("start_date", values.start_date)
                formData.append("end_date", values.end_date)
                formData.append("banner_link", values.banner_link)
                formData.append("categoryfile", values.banner_image)
                formData.append("user_id", values.user_id)
                let res = await axios.post(`admin/advertisement/update`, formData)
                navigate('/advertise', { state: { message: res.data.message } })
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
                <title>Edit Advertisement</title>
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
                                        <h6 className="text-white text-capitalize ps-3">Edit Advertisement</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3" style={{ flexDirection: 'column' }}>
                                                <label>Choose User</label>
                                                <select
                                                    style={{ width: '100%' }}
                                                    type="text"
                                                    id='user_id'
                                                    name='user_id'
                                                    className="form-control"
                                                    autoComplete='off'
                                                    value={formik.values.user_id || ''}
                                                    onChange={formik.handleChange}
                                                >
                                                    <option value="">--select--</option>
                                                    {
                                                        usersData && usersData.map((item) => {
                                                            return (
                                                                <option key={item._id} value={item._id}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            {formik.errors.user_id ? <div className='text-danger'>{formik.errors.user_id}</div> : null}
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='banner_link'
                                                    name='banner_link'
                                                    className="form-control"
                                                    placeholder='Banner Link'
                                                    value={formik.values.banner_link || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.banner_link ? <div className='text-danger'>{formik.errors.banner_link}</div> : null}
                                            <div className="input-group input-group-outline mb-3 cusfl">
                                                <label>Start Date</label>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        renderInput={(params) => <TextField  {...params} />}
                                                        value={valueStart}
                                                        onChange={(newValue) => {
                                                            formik.setFieldValue('start_date', new Date(newValue))
                                                            setValueStart(newValue);
                                                            setValueEnd(newValue);
                                                            setMinDateTimeValueEnd(newValue)
                                                        }}
                                                        minDateTime={minDateTimeValueStart}
                                                        maxDateTime={maxDateTimeValueStart}
                                                    />
                                                </LocalizationProvider>

                                            </div>
                                            {formik.errors.start_date ? <div className='text-danger'>{formik.errors.start_date}</div> : null}
                                            <div className="input-group input-group-outline mb-3 cusfl">
                                                <label>End Date</label>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        renderInput={(params) => <TextField  {...params} />}
                                                        value={valueEnd}
                                                        onChange={(newValue) => {
                                                            setValueEnd(newValue);
                                                            formik.setFieldValue('end_date', new Date(newValue))
                                                            setMaxDateTimeValueStart(newValue)
                                                        }}
                                                        minDateTime={minDateTimeValueEnd}
                                                    />
                                                </LocalizationProvider>
                                                {formik.errors.end_date ? <div className='text-danger'>{formik.errors.end_date}</div> : null}
                                            </div>
                                            <div className="input-group input-group-outline mb-3" style={{ flexDirection: 'column' }}>
                                                <label>Banner Image</label>
                                                <input
                                                    style={{ width: '100%' }}
                                                    type="file"
                                                    id='banner_image'
                                                    name='banner_image'
                                                    className="form-control"
                                                    placeholder='Banner Image'
                                                    onChange={(event) => {
                                                        formik.setFieldValue("banner_image", event.target.files[0]);
                                                    }}
                                                />
                                            </div>
                                            {formik.errors.banner_image ? <div className='text-danger'>{formik.errors.banner_image}</div> : null}
                                            <div className="text-center">
                                                <Link to={'/advertise'} className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    Cancel
                                                </Link>&nbsp;&nbsp;
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
                    </LoadingOverlay>
                </div>
            </LayoutPage>
        </>
    );
}

export default EditCategory;