import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


function AddNew() {
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const navigate = useNavigate()
    
    const validationSchema = Yup.object({
        page_title: Yup.string().required("Page title is required").min(3,'Page title must be 3 characters long').max(50,'Page title must not exceed 50 characters'),
        page_content: Yup.string().required("Page content is required").min(50,'Page content must be 50 characters long').max(2000,'Page content must not exceed 2000 characters'),

    })
    const formik = useFormik({
        initialValues: {
            page_title: '',
            page_content: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setDisabledSubmit(true)
            try {
                console.log(values);
                let res = await axios.post(`admin/pages/add`, values)
                navigate('/content-pages', { state: { message: res.data.message } })
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
    return (
        <>
            <Helmet>
                <title>Add Page</title>
            </Helmet>
            <LayoutPage>
                <div className="row">

                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Add New Page</h6>
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2">
                                <div className="p-4">
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="input-group input-group-outline mb-3">
                                            <input
                                                type="text"
                                                id='page_title'
                                                name='page_title'
                                                className="form-control"
                                                placeholder='Page Title'
                                                value={formik.values.page_title || ''}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.errors.page_title ? <div className='text-danger'>{formik.errors.page_title}</div> : null}

                                        <div className="input-group input-group-outline mb-3">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={''}
                                                config={{
                                                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                                                }}
                                                onReady={(editor) => {
                                                    editor.editing.view.change((writer) => {
                                                        writer.setStyle(
                                                            "height",
                                                            "200px",
                                                            editor.editing.view.document.getRoot()
                                                        );
                                                        writer.setStyle(
                                                            "width",
                                                            "100%",
                                                            editor.editing.view.document.getRoot()
                                                        );
                                                    });
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    formik.setFieldValue(
                                                        "page_content",
                                                        data
                                                    );
                                                }}
                                            />
                                        </div>
                                        {formik.errors.page_content ? <div className='text-danger'>{formik.errors.page_content}</div> : null}

                                        <div className="text-center">
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