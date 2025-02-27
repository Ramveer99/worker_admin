import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as Yup from 'yup'
LoadingOverlay.propTypes = undefined

function EditCategory() {
    const { id } = useParams()
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    // const [categoryData, setBlogData] = useState([])
    const [loading, setLoading] = useState(false);
    const [longDescription, setlongDescription] = useState('');
    const [initialValues, setInitialValues] = useState({
        id: '',
        title: '',
        short_description: '',
        long_description: ''
    });
    const navigate = useNavigate()

    const getCategoryDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/blog?id=${id}`)
            // setBlogData(res.data.result)
            setInitialValues(prevState => ({
                ...prevState,
                id: res.data.result._id,
                title: res.data.result.title,
                short_description: res.data.result.short_description,
                long_description: res.data.result.long_description,
            }))
            // {
            //     id: res.data.result._id,
            //     title: res.data.result.title,
            //     short_description: res.data.result.short_description,
            //     long_description: res.data.result.long_description,
            // }
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

    // const validate = values => {
    //     const errors = {};

    //     if (!values.title) {
    //         errors.title = 'Blog title is required';
    //     } else if (values.title.length < 3) {
    //         errors.title = 'Blog title min length is 3 characters';
    //     } else if (values.title.length > 50) {
    //         errors.title = 'Blog title max length is 50 characters';
    //     }

    //     if (!values.short_description) {
    //         errors.short_description = 'Short description is required';
    //     } else if (values.short_description.length < 3) {
    //         errors.short_description = 'Short description min length is 3 characters';
    //     }

    //     if (!values.long_description) {
    //         errors.long_description = 'Long description is required';
    //     } else if (values.long_description.length < 20) {
    //         errors.long_description = 'Long description min length is 20 characters';
    //     }

    //     return errors;
    // };

    const validationSchema = Yup.object({
        title: Yup.string().required("Blog title is required").min(3, 'Blog title min length is 3 characters').max(50, 'Blog title max length is 50 characters'),
        short_description: Yup.string().required("Short description is required").min(3, 'Short description min length is 3 characters'),
        long_description: Yup.string().required("Long description is required").min(20, 'Long description min length is 20 characters')
    })
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        // validateOnBlur: true,
        // validateOnChange: false,
        onSubmit: async (values) => {
            if (longDescription === '' || longDescription.length < 20) {
                return
            }
            setDisabledSubmit(true)
            try {
                let formData = new FormData()
                formData.append("id", values.id)
                formData.append("categoryfile", values.categoryfile)
                formData.append("title", values.title)
                formData.append("short_description", values.short_description)
                formData.append("long_description", longDescription)

                let res = await axios.post(`admin/blog_update`, formData)

                navigate('/blogs', { state: { message: res.data.message } })
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
                } else {
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
            }
        },
    });

    useEffect(() => {
        getCategoryDetail()
    }, [getCategoryDetail])
    return (
        <>
            <Helmet>
                <title>Edit Blog</title>
            </Helmet>

            <LayoutPage>
                <div className="row">
                    <LoadingOverlay
                        active={loading}
                        spinner
                        text="Loading..."
                    >
                        <div className="col-12">
                            <div className="card my-4">
                                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                    <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                        <h6 className="text-white text-capitalize ps-3">Edit Blog</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="file"
                                                    id='categoryfile'
                                                    name='categoryfile'
                                                    className="form-control"
                                                    placeholder='Category Image'
                                                    onChange={(event) => {
                                                        formik.setFieldValue("categoryfile", event.target.files[0]);
                                                    }}
                                                />
                                            </div>
                                            {formik.errors.categoryfile ? <div className='text-danger'>{formik.errors.categoryfile}</div> : null}
                                            <div className="input-group input-group-outline mb-3">
                                                <input
                                                    type="text"
                                                    id='title'
                                                    name='title'
                                                    className="form-control"
                                                    placeholder='Title'
                                                    value={formik.values.title}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.title ? <div className='text-danger'>{formik.errors.title}</div> : null}
                                            <div className="input-group input-group-outline mb-3">
                                                <textarea
                                                    className="form-control"
                                                    placeholder='Short Description'
                                                    id='short_description'
                                                    name='short_description'
                                                    value={formik.values.short_description || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.short_description ? <div className='text-danger'>{formik.errors.short_description}</div> : null}
                                            {/* <div className="input-group input-group-outline mb-3">
                                                <textarea
                                                    className="form-control"
                                                    placeholder='Long Description'
                                                    id='long_description'
                                                    name='long_description'
                                                    rows={10}
                                                    value={formik.values.long_description || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div> */}
                                            <div className="input-group input-group-outline mb-3">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={formik.values.long_description}
                                                    config={{
                                                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                                                        placeholder: "Long Description"
                                                    }}
                                                    onReady={(editor) => {
                                                        editor.editing.view.change((writer) => {
                                                            writer.setStyle(
                                                                "height",
                                                                "200px",
                                                                editor.editing.view.document.getRoot()
                                                            );
                                                        });
                                                    }}

                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        setlongDescription(data)
                                                        // if (initialValues.id != '' && !loading) {
                                                        //     formik.setFieldValue(
                                                        //         "long_description",
                                                        //         data, true
                                                        //     );
                                                        // }
                                                    }}
                                                />
                                            </div>
                                            {longDescription === '' ? <div className='text-danger'>Long description is required</div> : longDescription.length < 20 ? <div className='text-danger'>Long description min length is 20 characters</div> : ''}
                                            <div className="text-center">
                                                <button type="button" onClick={() => navigate('/blogs')} className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    Cancel
                                                </button>&nbsp;&nbsp;
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit ? (
                                                            <div>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                <span className="sr-only"></span>  Submitting
                                                            </div>
                                                        ) : 'Submit'
                                                    }
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LoadingOverlay>
                </div>
            </LayoutPage>
        </>
    );
}

export default EditCategory;