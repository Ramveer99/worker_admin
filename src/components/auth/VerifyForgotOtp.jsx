import { Helmet } from 'react-helmet'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

function VerifyForgotOtp() {
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [disabledResendOtp, setDisabledResendOtp] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleResendOtp = async () => {
    try {
      setDisabledResendOtp(true)
      let res = await axios.post(`user/resend_otp`, { email: emailForOtp.email })
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
      setDisabledResendOtp(false)
    } catch (error) {
      toast(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: 'error'
      });
      setDisabledResendOtp(false)
    }
  }

  const validate = values => {
    const errors = {};

    if (!values.otp.length) {
      errors.otp = 'OTP is required';
    }
    else if (isNaN(values.otp) || values.otp.length < 4 || values.otp.length > 4) {
      errors.otp = 'OTP must be 4 digts long and contain numbers only'
    }
    return errors;
  };

  useEffect(() => {
    if (!location.state) {
      navigate('/forgot-password')
    }
    setEmailForOtp(location.state)
  }, [location.state, navigate])



  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validate,

    onSubmit: async (values) => {
      setDisabledSubmit(true)
      try {
        let otp = values.otp
        let res = await axios.post(`user/verifyforgetotp`,
          {
            userid: emailForOtp.id,
            otp: otp
          },
          {
            headers: {
              'Authorization': `Bearer ${emailForOtp.token}`
            }
          }
        )
        navigate('/reset-password', { state: { email: res.data.result.email } })
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
      setDisabledSubmit(false)
    },
  });


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Helmet>
        <title>Verify OTP</title>
      </Helmet>
      <main className="main-content  mt-0">
        <div className="page-header align-items-start min-vh-100" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80')` }}>
          <span className="mask bg-gradient-dark opacity-6"></span>
          <div className="container my-auto">
            <div className="row">
              <div className="col-lg-4 col-md-8 col-12 mx-auto">
                <div className="card z-index-0 fadeIn3 fadeInBottom">
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                      <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Verify Otp</h4>

                    </div>
                  </div>
                  <div className="card-body">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="input-group input-group-outline my-3">
                        <input
                          id='otp'
                          name='otp'
                          placeholder='OTP'
                          value={formik.values.otp}
                          onChange={formik.handleChange}
                          type="text"
                          className="form-control" />
                      </div>
                      {formik.errors.otp ? <div className='text-danger'>{formik.errors.otp}</div> : null}

                      <div className="text-center">
                      {
                        disabledResendOtp ? (
                          <div style={{textAlign:'left'}}>
                            <span className="spinner-border spinner-border-sm resent" role="status" aria-hidden="true"></span>
                            <span className="sr-only"></span>  Sending&nbsp;&nbsp;
                          </div>
                        ) : <span onClick={handleResendOtp} style={{cursor:'pointer',float:'left'}}>Resend OTP</span>
                      }
                       
                        <button className="btn bg-gradient-primary w-100 my-4 mb-2" type="submit" disabled={disabledSubmit}>
                          {
                            disabledSubmit ? (
                              <div>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span className="sr-only"></span>  Verifying
                              </div>
                            ) : 'Verify'
                          }
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer position-absolute bottom-2 py-2 w-100">
            <div className="container">
              <div className="row align-items-center justify-content-lg-between">
                <div className="col-12 col-md-6 my-auto">
                  <div className="copyright text-center text-sm text-white text-lg-start">
                    © Transact
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}

export default VerifyForgotOtp;
