import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import moment from 'moment'


function List() {
    const [jobData, setJobData] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage, setperPage] = useState(10);
    const [searchKeyWord, setSearchKeyword] = useState('');

    const columns = [
        {
            name: 'Employee Name',
            selector: row => row.user_data[0].name,
            sortable: true,
        },
        {
            name: 'Applied Position',
            selector: row => row.result_job[0].jobname,
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
                row.employer_approved !== "" ? row.employer_approved === "Yes" ? "Approved" : "Rejected" : "Pending"
            ),
        },
        {
            name: 'Admin Status',
            selector: row => (
                row.admin_approved !== "" ? row.admin_approved === "Yes" ? "Approved" : "Rejected" : "Pending"
            ),
        },
        {
            name: 'Skills Matched',
            selector: row => row.id,
            cell: row => (
                <>
                    {(() => {
                        let matchedCount = 0
                        if (row.user_data[0].skills) {
                            let eachMatchIncrementV = 100 / row.result_job[0].skills.length
                            row.result_job[0].skills.map((mapitem) => {
                                if (row.user_data[0].skills.includes(mapitem)) {
                                    return matchedCount += eachMatchIncrementV
                                } else {
                                    return false
                                }
                            })
                            return `${matchedCount}% Matched`
                        } else {
                            return '0% Matched'
                        }
                    })()}
                </>
            ),
            center: true
        },
        {
            name: 'Action',
            selector: row => row.id,
            cell: row => (
                row.admin_approved === "" ? <div>
                    <i title='Approve Application' onClick={() => handleApprove(row._id, "Yes")} style={{ cursor: 'pointer' }} className='fa fa-check text-success'></i>
                    &nbsp;&nbsp;
                    <i title='Reject Application' style={{ cursor: 'pointer' }} className='fa fa-times text-danger' onClick={() => handleApprove(row._id, "Yes")}></i>
                </div> : ""

            ),
            center: true
        },
    ];

    const handleApprove = async (job_id, job_status) => {
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
    }
    const getJobsList = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/applied_jobs?page=${pageNumber}&keyword=${searchKeyWord}&per_page=${perPage}&sort_by=${sortField}&sort_order=${sortDirection}`)
            console.log(res.data);
            setJobData(res.data.result.length?res.data.result[0].data:[])
            setTotalRows(res.data.result.length?res.data.result[0].count:0);
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