import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [state, updateState] = useState({ name: '', email: '', social_id: '' })
  const navigate = useNavigate()
  useEffect(() => {
    // console.log('the state after update is ', state)
  }, [state]);

  const validate = values => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Email is Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Password is Required';
    }

    return errors;
  };

  const handleShowHidePassword = () => {
    setShowPassword(!showPassword)
  }


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: async (values) => {
      setDisabledSubmit(true)
      try {
        let res = await axios.post(`admin/login`, values)
        localStorage.setItem('transact_auth_back', JSON.stringify(res.data.result))
        navigate('/dashboard')
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
        <title>Login</title>
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
                      <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Sign in</h4>

                    </div>
                  </div>
                  <div className="card-body">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="input-group input-group-outline my-3">
                        <input type="email"
                          id='email'
                          name='email'
                          placeholder='Email'
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          className="form-control"
                        />
                      </div>
                      {formik.errors.email ? <div className='text-danger'>{formik.errors.email}</div> : null}

                      <div className="input-group input-group-outline mb-3">
                        <input
                          type="password"
                          id='password'
                          name='password'
                          placeholder='Password'
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          className="form-control" />
                        {/* <FontAwesomeIcon icon={faEye}/> */}
                      </div>
                      {formik.errors.password ? <div className='text-danger'>{formik.errors.password}</div> : null}

                      <div className="text-center">
                        <button type="submit" className="btn bg-gradient-primary w-100 my-4 mb-2" disabled={disabledSubmit}>
                          {
                            disabledSubmit ? (
                              <div>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span className="sr-only"></span>  Signing In
                              </div>
                            ) : 'Sign In'
                          }
                        </button>
                      </div>
                      <p className="mt-4 text-sm text-center">
                        <Link to={'forgot-password'} className="text-primary text-gradient font-weight-bold">Forgot Password?</Link>
                      </p>
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
