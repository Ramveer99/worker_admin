import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmation from '../shared/DeleteConfirmation';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import './style.css'

function Users() {
    const location = useLocation()
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingDeleteModel, setLoadingDeleteModel] = useState(false);
    const [loadingDeleteModelConfirmText, setLoadingDeleteModelConfirmText] = useState('Deleting');
    const [totalRows, setTotalRows] = useState(0);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [perPage, setperPage] = useState(10);
    const [searchKeyWord, setSearchKeyword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [idBeingDeleting, setIdBeingDeleting] = useState(null);
    const [deleteModelTitle, setDeleteModelTitle] = useState('Confirm Delete');
    const [deleteModelMessage, setDeleteModelMessage] = useState('Are you sure want to delete this user?');
    const [deleteModelActionType, setDeleteModelActionType] = useState('Delete');
    const [selectedRows, setSelectedRows] = useState([]);
    const [samplePdf, setSamplePdf] = useState('');
    const navigate = useNavigate()
    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Mobile',
            selector: row => row.mobile,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                !row.admin_inactive ?
                    <span className='badge badge-sm bg-gradient-success'>Active</span> :
                    <span className='badge badge-sm bg-gradient-secondary'>Inactive</span>
            )
        },
        {
            name: 'Paid User',
            selector: row => row.paid_user,
            sortable: true,
            cell: row => (
                row.paid_user ?
                    <span className='badge badge-sm bg-gradient-success'>Yes</span> :
                    <span className='badge badge-sm bg-gradient-secondary'>No</span>
            )
        },
        {
            name: 'Action',
            selector: row => row.id,
            cell: row => (
                !row.admin_inactive ?
                    <>
                        <Link to={`/users/edit/${row._id}`}><i title='Edit' style={{ cursor: 'pointer' }} className='fa fa-pencil text-success'></i></Link>
                        &nbsp;&nbsp;<i title='Deactivate' style={{ cursor: 'pointer' }} className='fa fa-power-off text-danger' onClick={() => handleDeleteConfirm(row, 'Deactivate')}></i>
                        &nbsp;&nbsp;<i title='Delete' style={{ cursor: 'pointer' }} className='fa fa-trash text-danger' onClick={() => handleDeleteConfirm(row, 'Delete')}></i>
                        {
                            row.paid_user ?
                                <>
                                    <i title='Mark Unpaid' style={{ cursor: 'pointer' }} className='fas fa-file-invoice-dollar text-danger' onClick={() => handlePaidUnpaid(row)}></i>
                                </> :
                                <>
                                    <i title='Mark Paid' style={{ cursor: 'pointer' }} className='fas fa-money-bill text-success' onClick={() => handlePaidUnpaid(row)}></i>
                                </>
                        }
                    </>
                    :
                    <>
                        <Link to={`/users/edit/${row._id}`}><i title='Edit' style={{ cursor: 'pointer' }} className='fa fa-pencil text-success'></i></Link>
                        &nbsp;&nbsp;<i title='Activate' style={{ cursor: 'pointer' }} className='fa fa-power-off text-success' onClick={() => handleDeleteConfirm(row, 'Activate')}></i>
                        &nbsp;&nbsp;<i title='Delete' style={{ cursor: 'pointer' }} className='fa fa-trash text-danger' onClick={() => handleDeleteConfirm(row, 'Delete')}></i>
                        {
                            row.paid_user ?
                                <>
                                    <i title='Mark Unpaid' style={{ cursor: 'pointer' }} className='fas fa-file-invoice-dollar text-danger' onClick={() => handlePaidUnpaid(row)}></i>
                                </> :
                                <>
                                    <i title='Mark Paid' style={{ cursor: 'pointer' }} className='fas fa-money-bill text-success' onClick={() => handlePaidUnpaid(row)}></i>
                                </>
                        }
                    </>

            ),
            center: true
        },
    ];


    // Handle the displaying of the modal based on type and id
    const showDeleteModal = (type, id) => {
        alert('show delete modal')
    };

    const handlePaidUnpaid = async (user) => {
        console.log(user);
        try {
            setLoading(true)
            let res = await axios.post(`admin/markpaid`, {
                user_id: user._id,
                paid: !user.paid_user,
            })
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
            setPageNumber(1)
            getUsersList()
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
            setPageNumber(1)
            getUsersList()
        }
    }
    // Hide the modal
    const hideConfirmationModal = () => {
        setShowDeleteConfirm(false)
        setIdBeingDeleting(null)
        setLoadingDeleteModel(false)
    };

    // Handle the actual deletion of the item
    const submitDelete = async () => {
        // console.log(deleteModelActionType, idBeingDeleting);
        setLoadingDeleteModel(true)
        let confirmText = null
        let activeInactiveStatus = null
        let deleting = false
        if (deleteModelActionType === "Delete") {
            confirmText = 'Deleting'
            deleting = true
        } else if (deleteModelActionType === "Activate") {
            confirmText = 'Activating'
            activeInactiveStatus = "1"
        } else if (deleteModelActionType === "Deactivate") {
            confirmText = 'Deactivating'
            activeInactiveStatus = "0"
        }
        setLoadingDeleteModelConfirmText(confirmText)
        //  activate deactivate user
        try {
            let res = await axios.post(`admin/userstatus`, {
                id: idBeingDeleting,
                status: activeInactiveStatus,
                deleting: deleting
            })
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
            setShowDeleteConfirm(false)
            setLoadingDeleteModel(false)
            setPageNumber(1)
            getUsersList()
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
            setShowDeleteConfirm(false)
            setLoadingDeleteModel(false)
            setPageNumber(1)
            getUsersList()
        }
    };



    const handleDeleteConfirm = (row, type) => {
        setShowDeleteConfirm(true)
        setDeleteModelTitle(`Confirm ${type}`)
        setDeleteModelMessage(`Are you sure want to ${type} this user?`)
        setDeleteModelActionType(type)
        setIdBeingDeleting(row._id)
    }

    const getUsersList = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/userlist?page=${pageNumber}&keyword=${searchKeyWord.toLowerCase()}&per_page=${perPage}&sort_by=${sortField}&sort_order=${sortDirection}`)
            setUserData(res.data.result.userdata)
            setSamplePdf(res.data.result.sample_pdf)
            setTotalRows(res.data.result.total);
            setLoading(false);
        } catch (errors) {
            // console.log('======>in catch block',errors);
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
        setPageNumber(page)
        setperPage(newPerPage)
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            // console.log(event.target.value);
            if (event.target.value.length >= 3) {
                setSearchKeyword(event.target.value)
            }
        } else if (event.target.value === '') {
            setSearchKeyword('')
        }
    }
    const handleRowChange = ({ selectedRows }) => {
        // console.log(selectedRows);
        setSelectedRows(selectedRows)
    }
    const handleSelected = async (operationType) => {
        try {
            let selectedids = []
            selectedRows.map((item) => {
                return selectedids.push(item._id)
            })
            let res = await axios.post(`admin/do_selected_opertion`, {
                selectedUsers: selectedids,
                actionType: operationType
            })
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
            setSelectedRows([])
            setPageNumber(1)
            getUsersList()
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
            setShowDeleteConfirm(false)
            setLoadingDeleteModel(false)
            setPageNumber(1)
            getUsersList()
        }
    }
    const handleExcelImport = async (e) => {
        try {
            let formData = new FormData()
            setLoading(true)
            formData.append('excel_file', e.target.files[0])
            let res = await axios.post(`admin/upload_excel_users`, formData)
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
            let f = document.getElementById('excel_file_uploader')
            f.value = null
            setPageNumber(1)
            getUsersList()
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
                setLoading(false)
            } else {
                let f = document.getElementById('excel_file_uploader')
                f.value = null
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
                setPageNumber(1)
                getUsersList()
            }
        }
    }
    useEffect(() => {
        getUsersList()
        if (location.state) {
            let msg = location.state.message
            window.history.replaceState({}, document.title)
            navigate(location.pathname, { replace: true });
            toast(msg, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
        }
    }, [getUsersList, searchKeyWord, pageNumber, sortField, perPage, location])
    return (
        <>
            <Helmet>
                <title>Users Management</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3 custom-card-heading">Users</h6>
                                    <Link to="/users/addnew" title='Add New' className='btn btn-rounded btn-icon btn-primary custom-add-new-button'><i className='fa fa-plus'></i></Link>
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2">
                                <div className="p-4">
                                    {/* <form> */}
                                    <div className="input-group input-group-dynamic mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id='keyword'
                                            placeholder='Type keyword and press enter to search'
                                            onKeyUp={handleSearch}
                                            name='keyword' />
                                    </div>
                                    <div className="input-group input-group-dynamic">
                                        {
                                            selectedRows.length ? (
                                                <>
                                                    <button className='btn btn-danger' onClick={() => handleSelected('delete')}>({selectedRows.length})&nbsp;Delete Selected</button>
                                                    &nbsp;<button className='btn btn-success' onClick={() => handleSelected('activate')}>({selectedRows.length})&nbsp;Activate Selected</button>
                                                    &nbsp;<button className='btn btn-warning' onClick={() => handleSelected('deactivate')}>({selectedRows.length})&nbsp;Deactivate Selected</button>
                                                </>
                                            ) : ''
                                        }
                                        &nbsp;<button className='btn btn-info'>&nbsp;Upload Excel&nbsp;
                                            <input type="file" id='excel_file_uploader' onChange={(e) => handleExcelImport(e)} />
                                        </button>
                                        &nbsp;
                                        <button className='btn btn-success' onClick={() => saveAs(samplePdf, 'sample.xlsx')}>View Sample</button>
                                    </div>
                                    {/* </form> */}
                                </div>
                                <div className="table-responsive p-0">
                                    <DataTable
                                        columns={columns}
                                        data={userData}
                                        selectableRows
                                        onSelectedRowsChange={handleRowChange}
                                        progressPending={loading}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={totalRows}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        onChangePage={handlePageChange}
                                        sortServer
                                        sortIcon={<i className='fa fa-arrow-down'></i>}
                                        onSort={handleSort}
                                    />
                                    {
                                        showDeleteConfirm && (
                                            <DeleteConfirmation
                                                showModalHandler={showDeleteModal}
                                                loadingConfirmButton={loadingDeleteModel}
                                                loadingConfirmButtonText={loadingDeleteModelConfirmText}
                                                confirmModalHandler={submitDelete}
                                                hideModalHandler={hideConfirmationModal}
                                                modelTitle={deleteModelTitle}
                                                actionButtonClass={'primary'}
                                                actionType={deleteModelActionType}
                                                message={deleteModelMessage} />
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutPage>
        </>
    );
}

export default Users;