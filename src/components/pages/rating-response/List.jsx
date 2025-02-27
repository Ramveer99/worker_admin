import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function List() {
    let location = useLocation()
    let navigate = useNavigate()
    let rating = location?.state?.rating
    let requestId = location?.state?.request_id
    let [responseMessage, setResponseMessage] = useState()
    let [disabledSubmit, setDisabledSubmit] = useState(false)

    async function SendResponse() {

        try {
            setDisabledSubmit(true)
            let data = await axios.post('/admin/send-des-message',
                {
                    request_id: requestId,
                    message: responseMessage,
                })

            navigate('/rating-request')

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
            setDisabledSubmit(false)
        }
    }



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
                            <form style={{ margin: '20px 10px', display: 'flex', flexDirection: 'column' }}>
                                <label className='text-bold' style={{ fontSize: '20px' }} for='response'>
                                    Respond with the documents required for upgrading rating from {rating} to {rating + 1}
                                </label>
                                <textarea name='response' placeholder='Enter a response' aria-multiline style={{ marginBottom: '20px' }}
                                    onChange={(e) => {
                                        setResponseMessage(e?.target?.value)
                                        console.log(responseMessage)
                                    }}
                                />
                                {/* <p className='text-muted'>Enter a response for the user</p> */}
                                <Button onClick={SendResponse} disabled={disabledSubmit}>
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
