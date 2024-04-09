import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from './Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [usersCount, setusersCount] = useState(0);
    const getNationalityList = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/dashboard`)
            setusersCount(res.data.result)
            console.log()
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
    }, [])
    useEffect(() => {
        getNationalityList()

    }, [getNationalityList])
    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <LayoutPage>
                <div className="row">
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                                    <i className="material-icons opacity-10">weekend</i>
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">Total Users</p>
                                    <h4 className="mb-0">{usersCount.user_count}</h4>
                                </div>

                                

                            </div>

                            
                            {/* <hr className="dark horizontal my-0" /> */}
                            <div className="card-footer p-3">
                                <p className="mb-0"><span className="text-success text-sm font-weight-bolder"></span></p>
                            </div>
                        </div>

                    </div>

                   {/* accepted job card */}
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                                    <i className="material-icons opacity-10">weekend</i>
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">Total Admin Accepted job</p>
                                    <h4 className="mb-0">{usersCount.admin_accepted_job}</h4>
                                </div>

                                

                            </div>

                            
                            {/* <hr className="dark horizontal my-0" /> */}
                            <div className="card-footer p-3">
                                <p className="mb-0"><span className="text-success text-sm font-weight-bolder"></span></p>
                            </div>
                        </div>

                    </div>
                    {/* end accepted job card */}

                    
                    {/* declined job card  */}
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                                    <i className="material-icons opacity-10">weekend</i>
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">Total Admin Rejected job</p>
                                    <h4 className="mb-0">{usersCount.admin_rejected_job}</h4>
                                </div>
                            </div>

                            
                            {/* <hr className="dark horizontal my-0" /> */}
                            <div className="card-footer p-3">
                                <p className="mb-0"><span className="text-success text-sm font-weight-bolder"></span></p>
                            </div>
                        </div>

                    </div>
                    {/* end declined job card */}
                    
                    

                </div>


                 <div className='row' style={{marginTop:'63px'}}>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                                    <i className="material-icons opacity-10">weekend</i>
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">Total Employer Accepted job</p>
                                    <h4 className="mb-0">{usersCount.employer_accepted_job}</h4>
                                </div>
                            </div>

                            
                            {/* <hr className="dark horizontal my-0" /> */}
                            <div className="card-footer p-3">
                                <p className="mb-0"><span className="text-success text-sm font-weight-bolder"></span></p>
                            </div>
                        </div>

                       

                    </div>

                    <div className='col-xl-3 col-sm-6 mb-xl-0 mb-4' >
                    <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                                    <i className="material-icons opacity-10">weekend</i>
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">Total Employer Rejected job</p>
                                    <h4 className="mb-0">{usersCount.employer_rejected_job}</h4>
                                </div>
                            </div>

                            
                            {/* <hr className="dark horizontal my-0" /> */}
                            <div className="card-footer p-3">
                                <p className="mb-0"><span className="text-success text-sm font-weight-bolder"></span></p>
                            </div>
                        </div>
                    </div>
                 </div>
                <div className="row mt-4">

                </div>
            </LayoutPage>
        </>
    );
}

export default Dashboard;