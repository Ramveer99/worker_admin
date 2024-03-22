import React from 'react';
import { Helmet } from 'react-helmet';
import LayoutPage from '../Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import Multiselect from "multiselect-react-dropdown";
import * as Yup from 'yup'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './edit.css'

LoadingOverlay.propTypes = undefined

function EditCategory() {
    const { id } = useParams()
    const subareaRef = useRef(null);
    const cityRef = useRef(null);
    const subcityRef = useRef(null);
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [rolesData, setRolesData] = useState([])
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({ id: '', name: '', email: '', mobile: '' });
    const [profileData, setProfileData] = useState("");
    const [selectedSkills, setSelectedSkills] = useState(true);
    const [subareasData, setSubareasData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});
    const [selectedProvince, setSelectedProvince] = useState({});

    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSubarea, setSelectedSubarea] = useState('');
    const [citiesData, setCitiesData] = useState([]);
    const [provinceData, setProvinceData] = useState([]);

    const navigate = useNavigate()

    const getCategoryDetail = useCallback(async () => {
        try {
            setLoading(true);
            let res = await axios.get(`admin/user_detail?id=${id}`)
            console.log("--------------->",res.data.result);
            let skillArr = [];
            let skillsString = "";
            let locaSkillData = res.data.result.skilldata
            let alreadySkills = res.data.result.detail.skills
            locaSkillData.map((val) => {
                if (alreadySkills.includes(val._id)) {
                    skillsString += "," + val._id
                    return skillArr.push({ _id: val._id, name: val.name });
                } else {
                    return false
                }
            });
            skillsString = skillsString.replace(/^,|,$/g, "")
            setSelectedSkills(skillArr)
            setInitialValues({
                id: res.data.result.detail._id,
                name: res.data.result.detail.name,
                email: res.data.result.detail.email,
                mobile: res.data.result.detail.mobile,
                registration_number: res.data.result.detail.registration_number,
                vat_number: res.data.result.detail.vat_number,
                rate_type: res.data.result.detail.rate_type,
                country_id: res.data.result.detail.country_id,
                province_id:res.data.result.detail.province_id,
                city_id: res.data.result.detail.city_id,
                subarea_id: res.data.result.detail.subarea_id,
                rate_amount: res.data.result.detail.rate_amount,
                about_myself: res.data.result.detail.about_myself,
                director_id: res.data.result.detail.director_id,
                designation: res.data.result.detail.designation,
                fb_link: res.data.result.detail.fb_link,
                linkedin_link: res.data.result.detail.linkedin_link,
                twitter_link: res.data.result.detail.twitter_link,
                behance_link: res.data.result.detail.behance_link,
                rate_hour_basis: res.data.result.detail.rate_hour_basis,
                rate_daily_basis: res.data.result.detail.rate_daily_basis,
                contact_ref_name_1: res.data.result.detail.contact_ref_name_1,
                contact_ref_num_1: res.data.result.detail.contact_ref_num_1,
                contact_ref_name_2: res.data.result.detail.contact_ref_name_2,
                contact_ref_num_2: res.data.result.detail.contact_ref_num_2,
                contact_ref_name_3: res.data.result.detail.contact_ref_name_3,
                contact_ref_num_3: res.data.result.detail.contact_ref_num_3,
                skills: skillsString,
            })
            console.log("ididididi", res.data.result.detail.country_id)
            setProfileData(res.data.result)
            
            if (res.data.result.detail.country_id) {
                setSelectedCountry({ _id: res.data.result.detail.country_id._id, country_name: res.data.result.detail.country_id.country_name })
            }
            if (res.data.result.detail.province_id)
            {
                setSelectedProvince({_id:res.data.result.detail.province_id._id, province_name:res.data.result.detail.province_id.province_name})
                console.log("prov----------",res.data.result.detail.province_id.province_name)
            }
            if (res.data.result.detail.city_id) {
                setSelectedCity({ _id: res.data.result.detail.city_id._id, city_name: res.data.result.detail.city_id.city_name })
            }
            if (res.data.result.detail.subarea_id) {
                setSelectedSubarea({ _id: res.data.result.detail.subarea_id._id, subarea_name: res.data.result.detail.subarea_id.subarea_name })
            }
            setProvinceData(res.data.result.Province)
            console.log("province  ====",res.data.result)
            setCitiesData(res.data.result.cities)
            setSubareasData(res.data.result.subareas)
            setLoading(false);
        } catch (errors) {
            console.log(errors);
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
    }, [id])

    const handleCountryChange = async (e) => {
        setLoading(true)
        setSelectedCountry(e)
        setProvinceData([])
        setCitiesData([])
        setSubareasData([])
        setSelectedProvince('')
        setSelectedCity('')
        setSelectedSubarea('')
        let res = await axios.get(`admin/getprovincebycountry?id=${e._id}`)
        console.log(";;;;;;;;;;;;;;;",res)
        formik.setFieldValue('country_id', e._id)
        // formik.setFieldValue('city_id', '')

        // formik.setFieldValue('subarea_id', '')
        formik.setFieldValue('province_id', '')
        
        setProvinceData(res.data.result ? res.data.result : [])
        setCitiesData(res.data.result ? res.data.result : [])
        setProvinceData(res.data.result ? res.data.result : [] )
        setSubareasData(res.data.result ? res.data.result : [])
        setLoading(false)
    }

    const handleProvinceChange = async (e) => {
        setLoading(true)

        setSelectedProvince(e)
        setCitiesData([])
        setSubareasData([])
        setSelectedCity('')
        setSelectedSubarea('')
        let res = await axios.get(`admin/getcitiesbyprovince?id=${e._id}`)
        formik.setFieldValue('province_id', e._id)
        formik.setFieldValue('city_id', '')

        // formik.setFieldValue('subarea_id', '')
        console.log("setdata-----",res.data.result)
        setCitiesData(res.data.result ? res.data.result : [])
        setLoading(false)
    }

    const handleCityChange = async (e) => {
        setLoading(true)
        setSelectedCity(e)
        setSelectedSubarea('')
        let res = await axios.get(`user/getsubareabycity?id=${e._id}`)
        formik.setFieldValue('city_id', e._id)
        formik.setFieldValue('subarea_id', '')
        setSubareasData(res.data.result)
        setLoading(false)
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().required("Email is required").email('Must be a valid email'),
        mobile: Yup.string().required("Mobile number is required").matches(/^[0-9]+$/, "Mobile number must be only digits"),
        rate_type: Yup.string()
            .required("Please choose rate type"),
        // country_id: Yup.string().required("Please choose country"),
        // city_id: Yup.string().required("Please choose city"),
        // subarea_id: Yup.string().required("Please choose subarea"),
        rate_amount: Yup.string().required("Please enter rate amount")
            .matches(/^\d+(\.\d{1,2})?$/, "Rate amount must be in numeric"),
        about_myself: Yup.string()
            .required("About myself is required")
            .min(3, "About myself must be at least 3 characters long"),
        fb_link: Yup.string()
            .url("Facebook link must be a url"),
        linkedin_link: Yup.string()
            .url("Linked link must be a url"),
        twitter_link: Yup.string()
            .url("Twitter link must be a url"),
        behance_link: Yup.string()
            .url("Behance link must be a url"),
        contact_ref_name_1: Yup.string()
            .min(3, "Must be at lest 3 characters long"),
        contact_ref_num_1: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
        ,
        contact_ref_name_2: Yup.string()
            .min(3, "Must be at lest 3 characters long"),
        contact_ref_num_2: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
        ,
        contact_ref_name_3: Yup.string()
            .min(3, "Must be at lest 3 characters long"),
        contact_ref_num_3: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
        ,
        skills: Yup.string()
            .required("Please choose skills")
    })
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            console.log("value----->",values)
          
            setDisabledSubmit(true)
            try {
                // let res = await axios.post(`admin/user_update`, {
                //     id: values.id,
                //     name: values.name,
                //     email: values.email,
                //     mobile: values.mobile
                // })
                let res = await axios.post(`admin/user_update`, values)
                navigate('/users', { state: { message: res.data.message } })
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
    const handlePermissionChange = (event) => {
        if (event.target.checked) {
            setRolesData(oldArray => [...oldArray, event.target.value]);
        } else {
            setRolesData(rolesData.filter(item => item !== event.target.value));
        }
    }
    useEffect(() => {
        getCategoryDetail()
    }, [getCategoryDetail])
    return (
        <>
            <Helmet>
                <title>Edit User</title>
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
                                        <h6 className="text-white text-capitalize ps-3">Edit User</h6>
                                    </div>
                                </div>
                                <div className="card-body px-0 pb-2">
                                    <div className="p-4">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    id='name'
                                                    name='name'
                                                    className="form-control w100"
                                                    placeholder='Name'
                                                    value={formik.values.name || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.name ? <div className='text-danger'>{formik.errors.name}</div> : null}
                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Email</label>
                                                <input
                                                    type="text"
                                                    id='email'
                                                    name='email'
                                                    className="form-control w100"
                                                    placeholder='Email'
                                                    value={formik.values.email || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.email ? <div className='text-danger'>{formik.errors.email}</div> : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Mobile</label>
                                                <input
                                                    type="text"
                                                    id='mobile'
                                                    name='mobile'
                                                    className="form-control w100"
                                                    placeholder='Mobile'
                                                    value={formik.values.mobile || ''}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                            {formik.errors.mobile ? <div className='text-danger'>{formik.errors.mobile}</div> : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>
                                                    Registration Number
                                                    <input
                                                        type="text"
                                                        className='form-control'
                                                        id="registration_number"
                                                        name="registration_number"
                                                        value={formik.values.registration_number}
                                                        onChange={formik.handleChange}
                                                        placeholder="Registration Number"
                                                    />
                                                </label>

                                            </div>
                                            {formik.errors.registration_number ? (
                                                <div className="text-danger">
                                                    {formik.errors.registration_number}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>
                                                    VAT Number
                                                    <input
                                                        type="text"
                                                        className='form-control'
                                                        id="vat_number"
                                                        name="vat_number"
                                                        value={formik.values.vat_number}
                                                        onChange={formik.handleChange}
                                                        placeholder="VAT Number"
                                                    />
                                                </label>
                                            </div>
                                            {formik.errors.vat_number ? (
                                                <div className="text-danger">
                                                    {formik.errors.vat_number}
                                                </div>
                                            ) : null}


                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>
                                                    Director ID
                                                    <input
                                                        className='form-control'
                                                        type="text"
                                                        id="director_id"
                                                        name="director_id"
                                                        value={formik.values.director_id}
                                                        onChange={formik.handleChange}
                                                        placeholder="Director ID"
                                                    />
                                                </label>

                                            </div>
                                            {formik.errors.director_id ? (
                                                <div className="text-danger">
                                                    {formik.errors.director_id}
                                                </div>
                                            ) : null}


                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>
                                                    Enter Designation
                                                    <input
                                                        autoComplete='off'
                                                        type="text"
                                                        id="designation"
                                                        name="designation"
                                                        className='form-control'
                                                        value={formik.values.designation}
                                                        onChange={formik.handleChange}
                                                        placeholder="Designation"
                                                    />
                                                </label>

                                            </div>
                                            {formik.errors.designation ? (
                                                <div className="text-danger">
                                                    {formik.errors.designation}
                                                </div>
                                            ) : null}


                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>
                                                    Facebook Link
                                                    <input
                                                        type="text"
                                                        id="fb_link"
                                                        name="fb_link"
                                                        className='form-control'
                                                        value={formik.values.fb_link || ""}
                                                        onChange={formik.handleChange}
                                                        placeholder=" Facebook Link"
                                                    />
                                                </label>
                                            </div>
                                            {formik.errors.fb_link ? (
                                                <div className="text-danger">
                                                    {formik.errors.fb_link}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>
                                                    Linkedin Link
                                                    <input
                                                        type="text"
                                                        id="linkedin_link"
                                                        name="linkedin_link"
                                                        className='form-control'
                                                        value={formik.values.linkedin_link}
                                                        onChange={formik.handleChange}
                                                        placeholder="Linkedin Link"
                                                    />
                                                </label>

                                            </div>
                                            {formik.errors.linkedin_link ? (
                                                <div className="text-danger">
                                                    {formik.errors.linkedin_link}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>
                                                    Twitter Link
                                                    <input
                                                        type="text"
                                                        id="twitter_link"
                                                        name="twitter_link"
                                                        className='form-control'
                                                        value={formik.values.twitter_link}
                                                        onChange={formik.handleChange}
                                                        placeholder="Twitter Link"
                                                    />
                                                </label>

                                            </div>
                                            {formik.errors.twitter_link ? (
                                                <div className="text-danger">
                                                    {formik.errors.twitter_link}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>
                                                    Behance Link
                                                    <input
                                                        type="text"
                                                        id="behance_link"
                                                        name="behance_link"
                                                        className='form-control'
                                                        value={formik.values.behance_link}
                                                        onChange={formik.handleChange}
                                                        placeholder="Behance Link"
                                                    />
                                                </label>
                                            </div>
                                            {formik.errors.behance_link ? (
                                                <div className="text-danger">
                                                    {formik.errors.behance_link}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Rate Type
                                                    <select className='form-control' name="rate_type" id="rate_type" value={formik.values.rate_type} onChange={formik.handleChange}>
                                                        <option value={''}>Choose</option>
                                                        {
                                                            profileData && profileData.rate_types.map((optvalue) => {
                                                                return (
                                                                    <option key={optvalue._id} value={optvalue._id}>{optvalue.title}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </label>
                                            </div>
                                            {formik.errors.rate_type ? (
                                                <div className="text-danger">
                                                    {formik.errors.rate_type}
                                                </div>
                                            ) : null}


                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Rate Amount
                                                    <input
                                                        type="text"
                                                        className='form-control'
                                                        id='rate_amount'
                                                        name="rate_amount"
                                                        value={formik.values.rate_amount || ''}
                                                        onChange={formik.handleChange}
                                                        placeholder="Rate Amount" />
                                                </label>
                                            </div>
                                            {formik.errors.rate_amount ? (
                                                <div className="text-danger">
                                                    {formik.errors.rate_amount}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Contact Reference Name 1
                                                    <input
                                                        type="text"
                                                        id='contact_ref_name_1'
                                                        className='form-control'
                                                        name="contact_ref_name_1"
                                                        value={formik.values.contact_ref_name_1 || ''}
                                                        onChange={formik.handleChange}
                                                        placeholder="Contact Reference Name 1" />
                                                </label>
                                            </div>
                                            {formik.errors.contact_ref_name_1 ? (
                                                <div className="text-danger">
                                                    {formik.errors.contact_ref_name_1}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Contact Reference Number 1
                                                    <input
                                                        type="text"
                                                        id='contact_ref_num_1'
                                                        name="contact_ref_num_1"
                                                        className='form-control'
                                                        value={formik.values.contact_ref_num_1 || ''}
                                                        onChange={formik.handleChange}
                                                        placeholder="Contact Reference Number 1" />
                                                </label>
                                            </div>
                                            {formik.errors.contact_ref_num_1 ? (
                                                <div className="text-danger">
                                                    {formik.errors.contact_ref_num_1}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Contact Reference Name 2
                                                    <input
                                                        type="text"
                                                        id='contact_ref_name_2'
                                                        name="contact_ref_name_2"
                                                        className='form-control'
                                                        value={formik.values.contact_ref_name_2 || ''}
                                                        onChange={formik.handleChange}
                                                        placeholder="Contact Reference Name 2" />
                                                </label>
                                            </div>
                                            {formik.errors.contact_ref_name_2 ? (
                                                <div className="text-danger">
                                                    {formik.errors.contact_ref_name_2}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Contact Reference Number 2
                                                    <input
                                                        type="text"
                                                        id='contact_ref_num_2'
                                                        name="contact_ref_num_2"
                                                        className='form-control'
                                                        value={formik.values.contact_ref_num_2 || ''}
                                                        onChange={formik.handleChange}
                                                        placeholder="Contact Reference Number 2" />
                                                </label>

                                            </div>
                                            {formik.errors.contact_ref_num_2 ? (
                                                <div className="text-danger">
                                                    {formik.errors.contact_ref_num_2}
                                                </div>
                                            ) : null}


                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Contact Reference Name 3
                                                    <input
                                                        type="text"
                                                        id='contact_ref_name_3'
                                                        name="contact_ref_name_3"
                                                        className='form-control'
                                                        value={formik.values.contact_ref_name_3 || ''}
                                                        onChange={formik.handleChange}
                                                        placeholder="Contact Reference Name 3" />
                                                </label>
                                            </div>
                                            {formik.errors.contact_ref_name_3 ? (
                                                <div className="text-danger">
                                                    {formik.errors.contact_ref_name_3}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Contact Reference Number 3
                                                    <input
                                                        type="text"
                                                        id='contact_ref_num_3'
                                                        name="contact_ref_num_3"
                                                        className='form-control'
                                                        value={formik.values.contact_ref_num_3 || ''}
                                                        onChange={formik.handleChange}
                                                        placeholder="Contact Reference Number 3" />
                                                </label>

                                            </div>
                                            {formik.errors.contact_ref_num_3 ? (
                                                <div className="text-danger">
                                                    {formik.errors.contact_ref_num_3}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Choose Skills</label>
                                                <Multiselect
                                                    options={profileData ? profileData.skilldata : []} // Options to display in the dropdown
                                                    selectedValues={selectedSkills} // Preselected value to persist in dropdown
                                                    onSelect={(selectedlist) => {
                                                        let skillsString = "";
                                                        selectedlist.map((tem) => {
                                                            return (skillsString += "," + tem._id);
                                                        });
                                                        formik.setFieldValue(
                                                            "skills",
                                                            skillsString.replace(/^,|,$/g, "")
                                                        );
                                                    }} // Function will trigger on select event
                                                    onRemove={(selectedlist) => {
                                                        let skillsString = "";
                                                        selectedlist.map((tem) => {
                                                            return (skillsString += "," + tem._id);
                                                        });
                                                        formik.setFieldValue(
                                                            "skills",
                                                            skillsString.replace(/^,|,$/g, "")
                                                        );
                                                    }} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                />


                                            </div>
                                            {formik.errors.skills ? (
                                                <div className="text-danger">
                                                    {formik.errors.skills}
                                                </div>
                                            ) : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Choose Country</label>
                                                <Autocomplete
                                                    disablePortal
                                                    className='w-100'
                                                    id="combo-box-demo"
                                                    value={selectedCountry}
                                                    // inputValue={selectedCountry}
                                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                                    options={profileData && profileData.countries ? profileData.countries : []}
                                                    getOptionLabel={(option) => option.country_name ? option.country_name : ''}
                                                    renderOption={(props, option) => {
                                                        return (
                                                            <li {...props} key={option._id}>
                                                                {option.country_name}
                                                            </li>
                                                        );
                                                    }}
                                                    sx={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} label="" />}
                                                    onChange={(event, newval) => {
                                                        if (newval) {
                                                            formik.setFieldValue('country_id', newval._id)
                                                            formik.setFieldValue('province_id', '')
                                                            handleCountryChange(newval)
                                                        } else {
                                                            formik.setFieldValue('subarea_id', '')
                                                            formik.setFieldValue('city_id', '')
                                                            formik.setFieldValue('country_id', '')
                                                            setProvinceData([])
                                                            setCitiesData([])
                                                            setSubareasData([])
                                                            setSelectedCountry({})
                                                            setSelectedProvince({})
                                                            setSelectedCity({})
                                                            setSelectedSubarea({})
                                                            // const ele = cityRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
                                                            // if (ele)
                                                            //     ele.click();
                                                            const ele = cityRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
                                                            if (ele)
                                                                ele.click();
                                                        }

                                                    }}
                                                />
                                            </div>
                                            {formik.errors.country_id ? <div className='text-danger'>{formik.errors.country_id}</div> : null}

                                            

                                            {/* Add Province  */}
 

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Choose Province</label>
                                                <Autocomplete
                                                    disablePortal
                                                    ref={cityRef}
                                                    className='w-100'
                                                    id="combo-box-demo"
                                                    value={selectedProvince}
                                                    // inputValue={selectedCountry}
                                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                                    // options={provinceData && provinceData.countries ? provinceData.countries : []}
                                                    options={provinceData.length ? provinceData : []}
                                                    getOptionLabel={(option) => option.province_name ? option.province_name : ''}
                                                    renderOption={(props, option) => {
                                                        return (
                                                            <li {...props} key={option._id}>
                                                                {option.province_name}
                                                            </li>
                                                        );
                                                    }}
                                                    sx={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} label="" />}
                                                    onChange={(event, newval) => {
                                                        if (newval) {
                                                            formik.setFieldValue('province_id', newval._id)
                                                            // formik.setFieldValue('city_id', '')
                                                            handleProvinceChange(newval)
                                                        } else {
                                                            // formik.setFieldValue('subarea_id', '')
                                                            // formik.setFieldValue('city_id', '')
                                                            // formik.setFieldValue('province_id', '')
                                                            setCitiesData([])
                                                            setSubareasData([])
                                                            setSelectedProvince({})
                                                            setSelectedCity({})
                                                            setSelectedSubarea({})
                                                            // const ele = cityRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
                                                            // if (ele)
                                                            //     ele.click();
                                                            const ele = subcityRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
                                                            if (ele)
                                                                ele.click();
                                                        
                                                        }

                                                    }}
                                                />
                                            </div>
                                            {/* {formik.errors.province_id ? <div className='text-danger'>{formik.errors.province_id}</div> : null} */}





                                             {/* End of Province  */}



                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Choose City</label>
                                                <Autocomplete
                                                    disablePortal
                                                    // ref={cityRef}
                                                    ref={subcityRef}
                                                    id="combo-box-demo"
                                                    className='w100'
                                                    value={selectedCity}
                                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                                    options={citiesData.length ? citiesData : []}
                                                    getOptionLabel={(option) => option.city_name ? option.city_name : ''}
                                                    renderOption={(props, option) => {
                                                        return (
                                                            <li {...props} key={option._id}>
                                                                {option.city_name}
                                                            </li>
                                                        );
                                                    }}
                                                    sx={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} label="" />}
                                                    onChange={(event, newval) => {
                                                        if (newval) {
                                                            formik.setFieldValue('city_id', newval._id)
                                                            handleCityChange(newval)
                                                        } else {
                                                            setSubareasData([])
                                                            setSelectedCity({})
                                                            setSelectedSubarea({})
                                                            // formik.setFieldValue('city_id', '')
                                                           
                                                           
                                                            // const ele = subareaRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
                                                            // if (ele)
                                                            //     ele.click();

                                                            const ele = subareaRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
                                                            if (ele)
                                                                ele.click();
                                                        }

                                                    }}
                                                />
                                            </div>
                                            {formik.errors.city_id ? <div className='text-danger'>{formik.errors.city_id}</div> : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>Choose Subarea</label>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    className='w100'
                                                    
                                                    value={selectedSubarea}
                                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                                    options={subareasData.length ? subareasData : []}
                                                    getOptionLabel={(option) => option.subarea_name ? option.subarea_name : ''}
                                                    renderOption={(props, option) => {
                                                        return (
                                                            <li {...props} key={option._id}>
                                                                {option.subarea_name}
                                                            </li>
                                                        );
                                                    }}
                                                    ref={subareaRef}
                                                    sx={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} label="" />}
                                                    onChange={(event, newval) => {
                                                        if (newval) {
                                                            formik.setFieldValue('subarea_id', newval._id)
                                                            setSelectedSubarea(newval)
                                                        } else {
                                                            formik.setFieldValue('subarea_id', '')
                                                            setSelectedSubarea({})
                                                            // setSubareasData([])
                                                        }

                                                    }}
                                                />

                                            </div>
                                            {formik.errors.subarea_id ? <div className='text-danger'>{formik.errors.subarea_id}</div> : null}

                                            <div className="input-group input-group-outline mb-3 f-col">
                                                <label>About Myself
                                                    <textarea
                                                        rows={5}
                                                        style={{ border: '1px solid black' }}
                                                        id='about_myself'
                                                        className='form-control'
                                                        name="about_myself"
                                                        value={formik.values.about_myself || ''}
                                                        onChange={formik.handleChange}
                                                        placeholder=""></textarea>
                                                </label>

                                            </div>
                                            {formik.errors.about_myself ? (
                                                <div className="text-danger">
                                                    {formik.errors.about_myself}
                                                </div>
                                            ) : null}

                                            <div className="text-center">
                                                <Link to={'/users'} className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    Cancel
                                                </Link>&nbsp;&nbsp;
                                                <button type="submit" className="btn btn-lg bg-gradient-primary btn-lg w-20 mt-4 mb-0" disabled={disabledSubmit}>
                                                    {
                                                        disabledSubmit ? (
                                                            <div>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                <span className="sr-only"></span>  Updating
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