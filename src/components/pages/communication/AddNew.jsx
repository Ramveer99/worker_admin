import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import Select from "react-select";
import LoadingOverlay from 'react-loading-overlay';
import './styles.css'
LoadingOverlay.propTypes = undefined



function AddNew() {
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [loading, setLoading] = useState(false);
    const [usersList, setUsersList] = useState([{ label: "Select All", value: "all" }]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const navigate = useNavigate()

    const validationSchema = Yup.object({
        emails: Yup.string().required("Please choose users"),
        content: Yup.string().required("Content is required").min(10, 'Content must be 10 characters long').max(2000, 'Content must not exceed 2000 characters'),

    })
    const formik = useFormik({
        initialValues: {
            emails: '',
            content: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let usersString = ''
                selectedUsers.map((item) => {
                    return usersString += ',' + item.label
                })
                let res = await axios.post(`admin/addCommunication`, {
                    emails: usersString.replace(/^,|,$/g,''),
                    description: values.content
                })
                navigate('/communication', { state: { message: res.data.message } })
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

    const getAllUsers = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/getAllUser`)
            let usersArr = [{ label: "Select All", value: "all" }]
            res.data.result.map((item) => {
                return usersArr.push({ label: item.email, value: item._id })
            })
            setUsersList(usersArr)
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

    useEffect(() => {
        getAllUsers()
    }, [getAllUsers])
    return (
        <>
            <Helmet>
                <title>Send new notifications</title>
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
                                        <h6 className="text-white text-capitalize ps-3">Send new notification</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div id='select_holder' className="input-group input-group-outline mb-3">
                                                <Select
                                                    name="Select Users"
                                                    options={usersList}
                                                    
                                                    isMulti={true}
                                                    value={selectedUsers}
                                                    onChange={selected => {
                                                        let sall = selected.find(option => option.value === "all")
                                                        if (sall) {
                                                            setSelectedUsers(usersList.slice(1))
                                                        } else {
                                                            setSelectedUsers(selected)
                                                        }
                                                        if (selected.length) {
                                                            formik.setFieldValue('emails', '123')
                                                        } else {
                                                            formik.setFieldValue('emails', '')
                                                        }
                                                        // console.log(sall);
                                                    }}
                                                />

                                            </div>
                                            {formik.errors.emails ? <div className='text-danger'>{formik.errors.emails}</div> : null}

                                            <div className="input-group input-group-outline mb-3">
                                                <textarea
                                                    id='content'
                                                    style={{ width: '100%' }}
                                                    rows={5}
                                                    name='content'
                                                    placeholder='Notification Content'
                                                    value={formik.values.content}
                                                    onChange={formik.handleChange}
                                                ></textarea>

                                                {formik.errors.content ? <div style={{marginTop:'5px'}} className='text-danger'>{formik.errors.content}</div> : null}
                                            </div>

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
                    </LoadingOverlay>
                </div>
            </LayoutPage>
        </>
    );
}

export default AddNew;