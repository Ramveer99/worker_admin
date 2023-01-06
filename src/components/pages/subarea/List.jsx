import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmation from '../shared/DeleteConfirmation';
import { Link, useLocation } from 'react-router-dom';
import { saveAs } from 'file-saver';


function List() {
    const location = useLocation()
    const [cityData, setCityData] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [loadingDeleteModel, setLoadingDeleteModel] = useState(false);
    const [loadingDeleteModelConfirmText, setLoadingDeleteModelConfirmText] = useState('Deleting');
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [perPage, setperPage] = useState(10);
    const [searchKeyWord, setSearchKeyword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [idBeingDeleting, setIdBeingDeleting] = useState(null);
    const [samplePdf, setSamplePdf] = useState('');
    // const [userData, setUserData] = useState([]);
    const [deleteModelTitle, setDeleteModelTitle] = useState('Confirm Delete');
    const [deleteModelMessage, setDeleteModelMessage] = useState('Are you sure want to delete this city?');
    const [deleteModelActionType, setDeleteModelActionType] = useState('Delete');
    const columns = [
        {
            name: 'City',
            selector: row => row.city_id.city_name,
        },
        {
            name: 'SubArea',
            selector: row => row.subarea_name,
            sortable: true,
        },
        {
            name: 'Created Date',
            selector: row => row.created_at,
        },
        {
            name: 'Action',
            selector: row => row.id,
            cell: row => (
                <div>
                    <Link to={`/subarea/edit/${row._id}`}>
                        <i title='Edit' style={{ cursor: 'pointer' }} className='fa fa-pencil text-success'></i>
                    </Link>
                    &nbsp;&nbsp;
                    <i title='Delete' style={{ cursor: 'pointer' }} className='fa fa-trash text-danger' onClick={() => handleDeleteConfirm(row, 'Delete')}></i>
                </div>
            ),
            center: true
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
        setLoadingDeleteModel(true)
        setLoadingDeleteModelConfirmText('Deleting')
        //  activate deactivate user
        try {
            let res = await axios.delete(`admin/subareadel/${idBeingDeleting}`)
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
            getSubareaList()
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
            getSubareaList()
        }
    };



    const handleExcelImport = async (e) => {
        try {
            let formData = new FormData()
            setLoading(true)
            formData.append('excel_file', e.target.files[0])
            let res = await axios.post(`admin/upload_excel_subarea`, formData)
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
            getSubareaList()
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
                getSubareaList()
            }
        }
    }



    const handleDeleteConfirm = (row, type) => {
        // console.log(row,type);
        setShowDeleteConfirm(true)
        setDeleteModelTitle(`Confirm ${type}`)
        setDeleteModelMessage(`Are you sure want to ${type} the  ${row?.city_name} City?`)
        setDeleteModelActionType(type)
        setIdBeingDeleting(row._id)
    }


    // const getSubareaList = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         let res = await axios.get(`admin/citylist?page=${pageNumber}&keyword=${searchKeyWord}&per_page=${perPage}&sort_by=${sortField}&sort_order=${sortDirection}`)
    //         // console.log(res);
    //         setCityData(res.data.result.citydata)
    //         setTotalRows(res.data.result.total);
    //         setLoading(false);
    //     } catch (errors) {
    //         toast(errors.response.data.message, {
    //             position: "top-right",
    //             autoClose: 2000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             type: 'error'
    //         });
    //     }
    // }, [pageNumber, perPage, sortField, sortDirection, searchKeyWord])


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

    // get smaple from server
    const getSubareaList = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/subarealist?page=${pageNumber}&keyword=${searchKeyWord.toLowerCase()}&per_page=${perPage}&sort_by=${sortField}&sort_order=${sortDirection}`)
            console.log(res);
            setCityData(res.data.result.citydata)
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
        getSubareaList()
        if (location.state) {
            let msg = location.state.message
            window.history.replaceState({}, document.title)
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
    }, [getSubareaList, searchKeyWord, pageNumber, sortField, perPage, location])
    return (
        <>
            <Helmet>
                <title>Subarea Management</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3 custom-card-heading">Subareas</h6>
                                    <Link to="/subarea/addnew" title='Add New' className='btn btn-rounded btn-icon btn-primary custom-add-new-button'><i className='fa fa-plus'></i></Link>
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
                                    <div className="input-group input-group-dynamic">
                                       
                                        &nbsp;<button className='btn btn-info'>&nbsp;Upload Excel&nbsp;
                                            <input type="file" id='excel_file_uploader' onChange={(e) => handleExcelImport(e)} />
                                        </button>
                                        &nbsp;
                                    <button className='btn btn-success' onClick={() => saveAs(samplePdf, 'sample.xlsx')}>View Sample</button>
                                    </div>
                                </div>
                                <div className="table-responsive p-0">
                                    <DataTable
                                        columns={columns}
                                        data={cityData}
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
                                                loadingConfirmButton={loadingDeleteModel}
                                                loadingConfirmButtonText={loadingDeleteModelConfirmText}
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

export default List;