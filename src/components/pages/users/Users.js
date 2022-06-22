import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmation from '../shared/DeleteConfirmation';


function Users() {
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(false);
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
    const columns = [
        {
            name: 'Id',
            selector: row => row._id,
        },
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
                row.status === "1" ?
                    <span className='badge badge-sm bg-gradient-success'>Active</span> :
                    <span className='badge badge-sm bg-gradient-secondary'>Inactive</span>
            )
        },
        {
            name: 'Action',
            selector: row => row.id,
            sortable: true,
            cell: row => (
                row.status === "1" ?
                    <i title='Deactivate' style={{ cursor: 'pointer' }} className='fa fa-power-off text-danger' onClick={() => handleDeleteConfirm(row, 'Deactivate')}></i>
                    : <i title='Activate' style={{ cursor: 'pointer' }} className='fa fa-power-off text-success' onClick={() => handleDeleteConfirm(row, 'Activate')}></i>
            )
        },
    ];


    // Handle the displaying of the modal based on type and id
    const showDeleteModal = (type, id) => {
        alert('show delete modal')
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setShowDeleteConfirm(false)
        setIdBeingDeleting(null)
    };

    // Handle the actual deletion of the item
    const submitDelete = async () => {
        console.log(deleteModelActionType,idBeingDeleting);
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
            let res = await axios.get(`admin/userlist?page=${pageNumber}&keyword=${searchKeyWord}&per_page=${perPage}&sort_by=${sortField}&sort_order=${sortDirection}`)
            setUserData(res.data.result.userdata)
            setTotalRows(res.data.result.total);
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
        setSortField(column.name.toLowerCase())
        setSortDirection(sortDirection)
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        setPageNumber(page)
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
        getUsersList()
    }, [getUsersList, searchKeyWord, pageNumber, sortField, perPage])
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
                                    <h6 className="text-white text-capitalize ps-3">Users</h6>
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
                                    {/* </form> */}
                                </div>
                                <div className="table-responsive p-0">
                                    <DataTable
                                        columns={columns}
                                        data={userData}
                                        progressPending={loading}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={totalRows}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        onChangePage={handlePageChange}
                                        sortServer
                                        onSort={handleSort}
                                    />
                                    {
                                        showDeleteConfirm && (
                                            <DeleteConfirmation
                                                showModalHandler={showDeleteModal}
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