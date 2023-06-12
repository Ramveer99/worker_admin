import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';




// All Status codes for requests regarding rating upgrade
// 0 - Means no action taken
// 1 - Means request accepted , documents pending
// 2 - Means documents recieved , approval pending
// 3 - Means request has been declined
// 4 - Means document recieved and approved


//Document Status code
// false - Have NOT uploaded documents
// true - Have Uploaded documents




function List() {
    const [ratingdata, setRatingData] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage, setperPage] = useState(10);
    const [searchKeyWord, setSearchKeyword] = useState('');
    const navigate = useNavigate()
    const [hideOptions, setHideOptions] = useState(false)


    const rows = [
        { requested_by: 'Employee1', requested_on: '02/02/2022', current_rating: 0, documents: false, status: 0 },
        { requested_by: 'Employee2', requested_on: '13/01/2021', current_rating: 0, documents: false, status: 1 },
        { requested_by: 'Employee3', requested_on: '11/01/2020', current_rating: 0, documents: true, status: 4 },
    ]

    const columns = [
        {
            name: 'Requested By',
            selector: row => row?.requested_by?.name,
            sortable: true,
        },
        // {
        //     name: `Request ID`,
        //     selector: row => row?.request_id,
        //     // selector: row => row.employer_data[0].name,
        //     // sortable: true,
        // },
        {
            name: 'requested On',
            selector: row => row?.requested_on,
            sortable: true,
        },
        {
            name: 'Current Rating',
            selector: row => row?.requested_by?.rating,
            // selector: row => moment(row?.created_at).format('DD MMMM, YYYY'),
            sortable: true,
        },
        {
            name: 'Documents',
            cell: row => (
                (row?.status >= 2) ? 
                row.documents && row.documents.map((item)=>{
                    // console.log('@@@@@',item);
                return <a href={item}  rel='noreferrer' target='_blank' style={{ color: 'blue' }}>Review Documents</a>
                })
                

                    : <span>Has not uploaded documents yet</span>
            ),
            // selector: row => (
            //     row?.employer_approved !== "0" ? row?.employer_approved === "Yes" ? "Approved" : "Rejected" : "Pending"
            // ),
        },
        {
            name: 'Status',
            cell: row => (
                row?.status == "0" ? <span> No action taken </span>
                    : row?.status == "1" ? <span>Request Accepted, Documents pending</span>
                        : row?.status == "2" ? <span>Documents Recieved , Approval Pending</span>
                            : row?.status == "3" ? <span>Request Rejected</span>
                                : row?.status == "4" ? <span>Documents Recieved and Approved</span>
                                : row?.status == "5" ? <span>Request Rejected</span>
                                    : <span>Unknown status</span>
            ),
            // selector: row => (
            //     row?.admin_approved !== "0" ? row?.admin_approved === "Yes" ? "Approved" : "Rejected" : "Pending"
            // ),
        },
        // {
        //     name: 'Skills Matched',
        //     selector: row => row.id,
        //     cell: row => (
        //         <>
        //             {(() => {
        //                 let matchedCount = 0
        //                 if (row.user_data[0].skills) {
        //                     let eachMatchIncrementV = 100 / row.result_job[0].skills.length
        //                     row.result_job[0].skills.map((mapitem) => {
        //                         if (row.user_data[0].skills.includes(mapitem)) {
        //                             return matchedCount += eachMatchIncrementV
        //                         } else {
        //                             return false
        //                         }
        //                     })
        //                     return `${matchedCount}% Matched`
        //                 } else {
        //                     return '0% Matched'
        //                 }
        //             })()}
        //         </>
        //     ),
        //     center: true
        // },
        {
            name: 'Action',
            selector: row => row?.id,
            cell: row => (
                <>
                    {/* if the request has not been interacted with , show approve request button */}
                    {(row?.status < 1) ? (<i title='accept request' className='fa fa-check'
                        onClick={
                            () => {
                                navigate('/respond-to-rating', {
                                    state: {
                                        rating: row?.requested_by?.rating,
                                        request_id: row?._id
                                    }
                                })
                            }}

                        style={{ color: 'green', marginLeft: '4px', fontSize: '15px', cursor: 'pointer' }} />)
                        : null
                    }

                    {/* if the requested documents have been apporoved recieved and approved , show below icon 
                else show the reject request icon
            */}
                    {
                        (row?.status != 2) ? (null)
                            : (
                                <>
                                    <i title='approve document' hidden={hideOptions} className="fa fa-arrow-up" onClick={() => { ApproveRatingDocuments(row) }} style={{ color: 'blue', marginLeft: '4px', fontSize: '15px', cursor: 'pointer' }} />
                                    <i title='reject document' hidden={hideOptions}
                                        onClick={
                                            () => {
                                                navigate('/reject-rating-docs', {
                                                    state: {
                                                        requested_by: row?.requested_by?._id,
                                                        request_id: row?._id,
                                                        status: 3
                                                    }
                                                })
                                            }}
                                        className="fa fa-user-slash" style={{ color: 'red', marginLeft: '4px', fontSize: '15px', cursor: 'pointer' }} />
                                </>
                            )
                    }
                    {
                    }


                    {/* this icon lets us send comments/feedback to the user requesting rating review */}

                    {/* <i className="fa fa-comment" onClick={
                ()=>{
                        navigate('/respond-to-rating')
                }

            }  style={{color:'green' , marginLeft:'4px', fontSize:'15px' ,  cursor: 'pointer' }}/> */}

                </>
            ),
            // cell: row => (
            //     row.admin_approved === "0" ? row.employer_approved === "0" ? <span>Waiting Employer approval</span> :row.employer_approved === "Yes"? <div>
            //         <i title='Approve Application' onClick={() => handleApprove(row._id, "Yes")} style={{ cursor: 'pointer' }} className='fa fa-check text-success'></i>
            //         &nbsp;&nbsp;
            //         <i title='Reject Application' style={{ cursor: 'pointer' }} className='fa fa-times text-danger' onClick={() => handleApprove(row._id, "No")}></i>
            //     </div>:"" : ""

            // ),
            center: true
        },
    ];

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


    const ApproveRatingDocuments = async (row) => {
        try {
            let data = await axios.post('/admin/finalize-request', {
                request_id: row?._id,
                requested_by: row?.requested_by?._id,
                status: 4,
            })

            // console.log(data)

            toast(data?.data?.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });

            setHideOptions(true)


        }
        catch (errors) {
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
    }


    const GetRatingRequestList = async () => {
        setLoading(true)
        try {
            let data = await axios.get('/admin/rating-requests')
            console.log(data.data.message)
            setRatingData(data?.data?.message)
        }
        catch (errors) {
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
        setLoading(false)
    }

    useEffect(() => {
        GetRatingRequestList()
    }, [])

    return (
        <>
            <Helmet>
                <title>Requests for Rating</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3 custom-card-heading">Rating Requests</h6>
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
                                        data={ratingdata}
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