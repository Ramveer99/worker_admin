import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { saveAs } from 'file-saver';
import LayoutPage from '../Layout';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import moment from 'moment'
import { Button } from 'react-bootstrap';


export default function List() {
  const [sampleFile, setSampleFile] = useState('');


const columns = [
  {
    name: 'Document Name',
    selector: row => row?.filename,
    sortable: true,
},
{
  name: 'Document Link',
  selector: row => row?.filelink,
  cell : row => (
    <button className='btn btn-success' onClick={() => saveAs(sampleFile, 'sample.xlsx')}>Download Document</button>
    )
  },
]
const rows = [
  {
    filename: 'file1.txt',
    filelink: 'https://filehosting.com'
  },
  {
    filename: 'file2.xml',
    filelink: 'https://filehosting.com'
  },
]

  return (
    <>
            <Helmet>
                <title>Documents</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3 custom-card-heading">Documents to be approved</h6>
                                    {/* <Link to="/skills/addnew" title='Add New' className='btn btn-rounded btn-icon btn-primary custom-add-new-button'><i className='fa fa-plus'></i></Link> */}
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2">

                                {/* <div className="p-4">
                                    <div className="input-group input-group-dynamic mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id='keyword'
                                            placeholder='Type keyword and press enter to search'
                                            onKeyUp={handleSearch}
                                            name='keyword' />
                                    </div>
                                </div> */}
                                {/* <div className="table-responsive p-0">*/}
                                    <DataTable
                                        columns={columns}
                                        data={rows}
                                        // progressPending={loading}
                                        // pagination
                                        // paginationServer
                                        // paginationTotalRows={totalRows}
                                        // onChangeRowsPerPage={handlePerRowsChange}
                                        // onChangePage={handlePageChange}
                                        // sortServer
                                        // onSort={handleSort}
                                    />
                                {/* </div> */}
                            </div>
                            <Button>
                              Approve Documents
                            </Button>
                        </div>
                    </div>
                </div>
            </LayoutPage>
        </>
  )
}
