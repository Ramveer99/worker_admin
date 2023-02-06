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
import { Button , Form } from 'react-bootstrap';

export default function List() {
  return (
    <>
            <Helmet>
                <title>Respond To User</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3 custom-card-heading">Send Response To User</h6>
                                    {/* <Link to="/skills/addnew" title='Add New' className='btn btn-rounded btn-icon btn-primary custom-add-new-button'><i className='fa fa-plus'></i></Link> */}
                                </div>
                            </div>
                            <form style={{margin:'20px 10px', display:'flex', flexDirection:'column'}}>
                              <label className='text-bold' style={{fontSize:'20px'}} for='response'>Respond</label>
                              <textarea name='response' placeholder='Enter a response' aria-multiline style={{marginBottom:'20px'}}/>
                              {/* <p className='text-muted'>Enter a response for the user</p> */}
                            <Button>
                              Send Response
                            </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </LayoutPage>
        </>
    
  )
}
