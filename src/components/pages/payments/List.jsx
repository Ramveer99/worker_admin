import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment'
import { saveAs } from "file-saver";
import { Link } from 'react-router-dom';


function List() {
    const [paymentData, setPaymentData] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage, setperPage] = useState(10);
    const [searchKeyWord, setSearchKeyword] = useState('');

    const columns = [
        {
            name: 'Employer Name',
            selector: row => row.user_data[0].name,
            // sortable: true,
        },
        {
            name: 'Invoic Number',
            selector: row => row.invoice_number,
            // sortable: true,
        },
        {
            name: 'Amount',
            selector: row => '$' + row.amount.toFixed(2),
            sortable: true,
        },
        {
            name: 'Invoice Date',
            selector: row => moment(row.created_at).format('DD MMMM, YYYY'),
            sortable: true,
        },
        {
            name: 'Invoice File',
            selector: row => (
                <Link to={''} onClick={() => {
                    saveAs(
                        row.invoice_file,
                        "Invoice.pdf"
                    );
                }}><i className='fa fa-download'></i>&nbsp;Download Invoice</Link>
            ),
        },
        {
            name: 'Refund Status',
            selector: row => (
                row.refund_status === '' ? 'PENDING' : row.refund_status.toUpperCase()
            ),
        },
        {
            name: 'Action',
            selector: row => row.id,
            cell: row => (
                row.refund_requested && row.refund_status === '' ? <div>
                    <i title='Accept Refund' onClick={() => handleRefund(row._id, "accepted")} style={{ cursor: 'pointer' }} className='fa fa-check text-success'></i>
                    &nbsp;&nbsp;
                    <i title='Reject Refund' style={{ cursor: 'pointer' }} className='fa fa-times text-danger' onClick={() => handleRefund(row._id, "rejected")}></i>
                </div> : ""

            ),
            center: true
        },
    ];

    const handleRefund = async (payment_id, payment_status) => {
        try {
            setLoading(true)
            let res = await axios.post(`admin/refund-payment`, { payment_id: payment_id, status: payment_status })
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
            getPaymentsList()
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
    const getPaymentsList = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/payments_list?page=${pageNumber}&keyword=${searchKeyWord}&per_page=${perPage}&sort_by=${sortField}&sort_order=${sortDirection}`)
            // console.log(res.data);
            setPaymentData(res.data.result.length ? res.data.result[0].data : [])
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
        getPaymentsList()
    }, [getPaymentsList, searchKeyWord, pageNumber, sortField, perPage])

    return (
        <>
            <Helmet>
                <title>Payments</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3 custom-card-heading">Payments</h6>
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
                                        data={paymentData}
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