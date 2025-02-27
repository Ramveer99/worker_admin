import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function AddNew() {
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    // const [initialValues, setInitialValues] = useState()
    const navigate = useNavigate()

    const validate = values => {
        const errors = {};

        if (!values.categoryfile) {
            errors.categoryfile = 'Blog Image is required';
        }

        if (!values.title) {
            errors.title = 'Blog title is required';
        } else if (values.title.length < 3) {
            errors.title = 'Blog title min length is 3 characters';
        }
        // else if (values.title.length > 50) {
        //     errors.title = 'Blog title max length is 50 characters';
        // }

        if (!values.short_description) {
            errors.short_description = 'Short description is required';
        } else if (values.short_description.length < 3) {
            errors.short_description = 'Short description min length is 3 characters';
        }
        // else if (values.short_description.length > 50) {
        //     errors.short_description = 'Short description max length is 50 characters';
        // }


        if (!values.long_description) {
            errors.long_description = 'Long description is required';
        } else if (values.long_description.length < 20) {
            errors.long_description = 'Long description min length is 20 characters';
        }
        // else if (values.long_description.length > 500) {
        //     errors.long_description = 'Long description max length is 500 characters';
        // }

        return errors;
    };
    const formik = useFormik({
        initialValues: {
            categoryfile: '',
            title: '',
            short_description: '',
            long_description: ''
        },
        validate,
        onSubmit: async (values) => {
            let formData = new FormData()

            formData.append("categoryfile", values.categoryfile)
            formData.append("title", values.title)
            formData.append("short_description", values.short_description)
            formData.append("long_description", values.long_description)

            setDisabledSubmit(true)
            try {
                let res = await axios.post(`admin/blog_add`, formData)
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
    return (
        <>
            <Helmet>
                <title>Add Blog</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Add New Blog</h6>
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
                                                value={formik.values.title || ''}
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
                                        <div className="input-group input-group-outline mb-3">
                                            {/* <textarea
                                                className="form-control"
                                                placeholder='Long Description'
                                                id='long_description'
                                                name='long_description'
                                                rows={10}
                                                value={formik.values.long_description || ''}
                                                onChange={formik.handleChange}
                                            /> */}

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
                                                    formik.setFieldValue(
                                                        "long_description",
                                                        data, true
                                                    );
                                                }}
                                            />
                                        </div>
                                        {formik.errors.long_description ? <div className='text-danger'>{formik.errors.long_description}</div> : null}
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
                </div>
            </LayoutPage>
        </>
    );
}

export default AddNew;