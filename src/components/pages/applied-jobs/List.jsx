import React, { useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment'
import { Modal, Button } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { saveAs } from "file-saver";


function List() {
    const [jobData, setJobData] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingCommentModel, setLoadingCommentModel] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage, setperPage] = useState(10);
    const [searchKeyWord, setSearchKeyword] = useState('');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [jobIdBeingRejected, setJobIdBeingRejected] = useState(null);
    const rejectJobForm = useRef();
    // Hide the modal
    const hideCommentModal = () => {
        setShowCommentModal(false)
        setJobIdBeingRejected(null)
    };

    // Handle the actual deletion of the item
    const submitReject = async () => {
        rejectJobForm.current.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
        );
    };

    const columns = [
        {
            name: 'Employee Name',
            selector: row => row.user_data[0].name,
            sortable: true,
        },
        {
            name: 'Employer Name',
            selector: row => row.employer_data[0].name,
            // sortable: true,
        },
        {
            name: 'Applied Position',
            selector: row => row.job_title_info[0].job_title,
            sortable: true,
        },
        {
            name: 'Rate type',
            selector: row => row.rate_type,
            sortable: true,
        },
        {
            name: 'Applied Date',
            selector: row => moment(row.created_at).format('DD MMMM, YYYY'),
            sortable: true,
        },
        {
            name: 'Employer Status',
            selector: row => (
                row.employer_approved !== "0" ? row.employer_approved === "Yes" ? <span className='text-success'>Approved</span> : <span className='text-danger'>Rejected</span> : "Pending"
            ),
        },
        {
            name: 'Admin Status',
            selector: row => (
                // row.admin_approved !== "0" ? row.admin_approved === "Yes" ? <span className='text-success'>Approved</span> : <span className='text-danger'>Rejected</span> : "Pending"
                    // row.user_data[0].paid_user ? <strong className='text-success'>Approved</strong> : row.admin_approved === "0" ? <strong className='text-primary'>Pending</strong> : row.admin_approved === "Yes" ? <strong className='text-success'>Approved</strong> : <strong className='text-danger'>Rejected</strong>
                    // row.user_data[0].paid_user === true ? 'Approved' : row.admin_approved === "0" ? "Pending" : row.admin_approved === "No" ? <span className='text-danger'><strong>Rejected</strong></span> : row.admin_approved 
                    <div>{row.admin_approve === 'Yes' ? 'Approved' : row.admin_approved === "0" ? "Pending" : row.admin_approved === "No" ? 'Rejected': 'Approved'}</div>
                    
                //    <div>
                //     {console.log("heeeee",row.employer_data[0].paid_user)}
                //    </div>         
                 ),
        },

        // {
        //     name: 'Download Resume',
        //     selector: row => row.id,
        //     cell: row => (
        //         <button className='btn btn-success btn-sm' title='Download Resume' onClick={() => {
        //             console.log(row)
        //             saveAs(
        //                 row && row.user_data.length ? row.user_data[0].resume_name : '',
        //                 "Resume.pdf"
        //             );
        //         }}><i className="fa fa-download"></i></button>
        //     ),
        //     center: true
        // },
        {
            name: 'Action',
            selector: row => row.id,
            cell: row => (
                // row.employer_data[0].paid_user === true ? '' :row.admin_approved === "0" ? row.employer_approved === "0" ? <span>Waiting Employer approval</span> : row.employer_approved === "Yes" ? <div>
                row.admin_approved === "0" ? row.employer_approved === "0" ? <span>Waiting Employer approval</span> : row.employer_approved === "Yes" ? <div>
                  
                    <i title='Approve Application' onClick={() => handleApprove(row._id, "Yes")} style={{ cursor: 'pointer' }} className='fa fa-check text-success'></i>
                    &nbsp;&nbsp;
                    <i title='Reject Application' style={{ cursor: 'pointer' }} className='fa fa-times text-danger' onClick={() => handleApprove(row._id, "No")}></i>
                </div> : "" : ""

            ),
            center: true
        },
    ];

    const formik = useFormik({
        initialValues: {
            comment: ''
        },
        validationSchema: Yup.object({
            comment: Yup.string().required("Comment is required").min(10, 'Comment must be 10 characters long').max(2000, 'Comment must not exceed 2000 characters'),

        }),

        onSubmit: async (values, { resetForm }) => {
            try {
                setLoadingCommentModel(true)
                let res = await axios.post(`employer/approve_job`, { job_id: jobIdBeingRejected, comment: values.comment, status: 'No', admin_approve: true })
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
                setShowCommentModal(false)
                resetForm();
                setPageNumber(1)
                getJobsList()
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
                resetForm();
                setPageNumber(1)
                setLoadingCommentModel(false)
                setShowCommentModal(false)
            }
        },
    });
    const handleApprove = async (job_id, job_status) => {
        if (job_status == "Yes") {
            try {
                setLoading(true)
                let res = await axios.post(`employer/approve_job`, { job_id: job_id, status: job_status, admin_approve: true })
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
                getJobsList()
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
                setLoading(false)
            }
        } else {
            setShowCommentModal(true)
            setJobIdBeingRejected(job_id)
        }
    }
    const getJobsList = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/applied_jobs?page=${pageNumber}&keyword=${searchKeyWord}&per_page=${perPage}&sort_by=${sortField}&sort_order=${sortDirection}`)
            console.log(res.data);
            setJobData(res.data.result.length ? res.data.result[0].data : [])
            // console.log("hhhhhhhhhhhh",res.data.result[0].data)
            setTotalRows(res.data.result.length ? res.data.result[0].count : 0);
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
    }, [pageNumber, perPage, sortField, sortDirection, searchKeyWord])


    const handlePageChange = page => {
        setPageNumber(page)
    };

    const handleSort = (column, sortDirection) => {
        setSortField(column.name.toLowerCase().replace(' ', '_'))
        setSortDirection(sortDirection)
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        setPageNumber(0)
        setperPage(newPerPage)
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            console.log(event.target.value);
            if (event.target.value.length >= 3) {
                setSearchKeyword(event.target.value)
            }
        } else if (event.target.value === '') {
            setSearchKeyword('')
        }
    }

    useEffect(() => {
        getJobsList()
    }, [getJobsList, searchKeyWord, pageNumber, sortField, perPage])

    return (
        <>
            <Helmet>
                <title>Applied Jobs</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3 custom-card-heading">Applied Jobs</h6>
                                    {/* <Link to="/skills/addnew" title='Add New' className='btn btn-rounded btn-icon btn-primary custom-add-new-button'><i className='fa fa-plus'></i></Link> */}
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2">
                                <div className="p-4">
                                    <div className="input-group input-group-dynamic mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id='keyword'
                                            placeholder='Type keyword and press enter to search'
                                            onKeyUp={handleSearch}
                                            name='keyword' />
                                    </div>
                                </div>
                                <div className="table-responsive p-0">
                                    <DataTable
                                        columns={columns}
                                        data={jobData}
                                        progressPending={loading}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={totalRows}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        onChangePage={handlePageChange}
                                        sortServer
                                        onSort={handleSort}
                                    />
                                    <Modal show={showCommentModal} onHide={hideCommentModal}>
                                        <Modal.Header closeButton style={{ borderBottom: 'unset' }}>
                                            <Modal.Title>Comment</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form ref={rejectJobForm} onSubmit={formik.handleSubmit}>
                                                <div className="input-group input-group-outline mb-3">
                                                    <textarea
                                                        rows={5}
                                                        type="text"
                                                        id='comment'
                                                        name='comment'
                                                        className="form-control"
                                                        placeholder='Comment'
                                                        value={formik.values.comment || ''}
                                                        onChange={formik.handleChange}
                                                    />
                                                </div>
                                                {formik.errors.comment ? <div className='text-danger'>{formik.errors.comment}</div> : null}
                                            </form>
                                        </Modal.Body>
                                        <Modal.Footer style={{ borderTop: 'unset' }}>
                                            <Button variant="success" onClick={hideCommentModal}>
                                                Cancel
                                            </Button>
                                            <Button
                                                disabled={loadingCommentModel}
                                                variant={'primary'}
                                                onClick={submitReject}
                                            >
                                                {loadingCommentModel ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                        <span className="sr-only"></span> {'Rejecting...'}
                                                    </>
                                                ) : 'Reject'}
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutPage>
        </>
    );
}

export default List;
