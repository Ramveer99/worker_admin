import { Helmet } from 'react-helmet'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import '../styles/Login.css'

function Login() {
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenForReset, setTokenForReset] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const validate = values => {
    const errors = {};
    let regex = /(?=(.*\d){2})(?=(.*[a-z]){2})(?=(.*[A-Z]){2})(?=(.*[!@#$%]){2})/
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password should be 8 or more characters';
    } else if (values.password.length > 15) {
      errors.password = 'Password must not exceed 15 characters';
    } else if (!regex.test(values.password)) {
      errors.password = 'Password must have atleast 2 uppercase, 2 lowercase, 2 special symbols and 2 digits';
    }

    if (!values.confirmpassword) {
      errors.confirmpassword = 'Confirm password is required';
    } else if (values.password !== values.confirmpassword) {
      errors.confirmpassword = 'Password and confirm password must be same';
    }
    return errors;
  };

  useEffect(() => {
    if (!location.state) {
      navigate('/forgot-password')
    }
    setTokenForReset(location.state)
  }, [location.state, navigate])

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmpassword: '',
    },
    validate,
    onSubmit: async (values) => {
      setDisabledSubmit(true)
      try {
        let res = await axios.post(`user/reset_forgetpassword`, {
          email: tokenForReset.email,
          password: values.password,
          confirmPassword: values.confirmpassword,
        })
        //  await axios.post(`user/reset_forgetpassword`, {
        //   email: tokenForReset.email,
        //   password: values.password,
        //   confirmPassword: values.confirmpassword,
        // })
        // localStorage.setItem('transact_auth_back', JSON.stringify(res.data.result))
        navigate('/', { state: { message: res.data.result.message } })
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
        setDisabledSubmit(false)
      }
    },
  });
  const showhidePassword = () => {
    setShowPassword(!showPassword)
  }
  const showhideConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }
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
        <title>Reset Password</title>
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
                      <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Reset Password</h4>

                    </div>
                  </div>
                  <div className="card-body">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="input-group input-group-outline my-3 pas-eye">
                        <input
                          type={showPassword ? "text" : "password"}
                          id='password'
                          name='password'
                          placeholder='Password'
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          className="form-control"
                        />
                        <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"} onClick={() => showhidePassword()}></i>
                      </div>
                      {formik.errors.password ? <div className='text-danger'>{formik.errors.password}</div> : null}

                      <div className="input-group input-group-outline my-3 pas-eye">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id='confirmpassword'
                          name='confirmpassword'
                          placeholder='Confirm Password'
                          value={formik.values.confirmpassword}
                          onChange={formik.handleChange}
                          className="form-control"
                        />
                        <i className={showConfirmPassword ? "fas fa-eye" : "fas fa-eye-slash"} onClick={() => showhideConfirmPassword()}></i>

                      </div>
                      {formik.errors.confirmpassword ? <div className='text-danger'>{formik.errors.confirmpassword}</div> : null}
                      <div className="text-center">
                        <button type="submit" className="btn bg-gradient-primary w-100 my-4 mb-2" disabled={disabledSubmit}>
                          {
                            disabledSubmit ? (
                              <div>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span className="sr-only"></span>  Resetting
                              </div>
                            ) : 'Reset'
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

export default Login;
