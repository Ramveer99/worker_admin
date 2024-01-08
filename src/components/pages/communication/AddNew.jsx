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
    const [rolesList, setRolesList] = useState([]);
    const [sendBy, setSendBy] = useState('users');
    const [skillsList, setSkillsList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate()
    const validationSchema = Yup.object({
        skill: Yup.array().nullable().required('Please choose an option'),
        content: Yup.string().required("Content is required").min(10, 'Content must be 10 characters long').max(2000, 'Content must not exceed 2000 characters'),

    })
    const formik = useFormik({
        initialValues: {
            skill: '',
            content: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/addCommunication`, values)
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

    const handleSendByChange = (e) => {
        // console.log('================', e.target.value);
        setSendBy(e.target.value)
    }
    const getAllUsers = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/getAllSkills`)
            setSkillsList(res.data.result.skills)
            setUsersList(res.data.result.users)
            setRolesList(res.data.result.job_roles)
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
                                                    options={rolesList}

                                                    isMulti={true}
                                                    value={selectedUsers}
                                                    onChange={selected => {
                                                        let sall = selected.find(option => option.value === "all")
                                                        if (sall) {
                                                            setSelectedUsers(rolesList.slice(1))
                                                        } else {
                                                            setSelectedUsers(selected)
                                                        }
                                                        if (selected.length) {
                                                            formik.setFieldValue('skill', selected)
                                                        } else {
                                                            formik.setFieldValue('skill', '')
                                                        }
                                                    }}
                                                />
                                                {formik.errors.skill ? <div style={{ marginTop: '5px' }} className='text-danger'>{formik.errors.skill}</div> : null}
                                            </div>


                                            {/* <div className="input-group input-group-outline mb-3">
                                                <select value={sendBy} className="form-control" name='skill' onChange={(e) => handleSendByChange((e))}>
                                                    <option value={'skills'}>Send by skills</option>
                                                    <option value={'users'}>Send by users</option>
                                                </select>
                                            </div> */}
                                            {/* {
                                                sendBy === 'users' && (
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
                                                                    formik.setFieldValue('emails', selected)
                                                                } else {
                                                                    formik.setFieldValue('emails', '')
                                                                }
                                                                // console.log(sall);
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            } */}
                                            {/* {formik.errors.skill ? <div className='text-danger'>{formik.errors.skill}</div> : null} */}


                                            {/* {
                                                sendBy === 'skills' && (
                                                    <div className="input-group input-group-outline mb-3">
                                                        <select value={formik.skill} className="form-control" name='skill' onChange={formik.handleChange}>
                                                            <option value={''}>--choose skill</option>
                                                            {
                                                                skillsList && skillsList.map((item, indx) => {
                                                                    return (
                                                                        <option key={indx} value={item._id}>{item.title}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                )
                                            } */}


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

                                                {formik.errors.content ? <div style={{ marginTop: '5px' }} className='text-danger'>{formik.errors.content}</div> : null}
                                            </div>

                                            <div className="text-center">
                                                <button type="button" onClick={() => navigate('/communication')} className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
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
                    </LoadingOverlay>
                </div>
            </LayoutPage>
        </>
    );
}

export default AddNew;