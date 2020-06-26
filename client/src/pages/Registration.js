import React from 'react';
import { Formik, useField, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import '../styles/auth.scss'

const CustomTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    

    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input {...field} {...props}/>
            {meta.touched && meta.error ? (
                <div>{meta.error}</div>
            ) : null}
        </>
    )
}

export const Registration = () => {

    const schema = Yup.object({
        userName: Yup.string().min(3, 'Must be at least 3 characters').max(15, 'Must be no more than 15 characters').required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().min(6, 'Must be at least 6 characters').required('Required')
    });

    const submit = (values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
            console.log(JSON.stringify(values));
            resetForm();
            setSubmitting(false);
        }, 3000);
       
    };

    return (
            <Formik
                initialValues={{
                    userName: "",
                    email: "",
                    password: "",
                }}

                validationSchema = {schema}

                onSubmit = {submit}
            >
                {props => (
                    <Form className='box'>
                        <h1 className="box__title">Registration</h1>

                        
                        <CustomTextInput className='box__input' name='userName' type='text' placeholder='Username' autoComplete='off' />
                        
                        <CustomTextInput className='box__input' name='email' type='text' placeholder='Email' autoComplete='off'/>

                        <CustomTextInput className='box__input' name='password' type='password' placeholder='Password' autoComplete='off'/>

                        <button className='box__submit-btn' type='submit'>{props.isSubmitting ? 'Loading...' : 'Sign Up'}</button>

                        <div className='box__bottom-text'>
                            Have an account? <Link to='/authorization' className='box__bottom-text__link'>Log in</Link>
                        </div>
                    </Form>
                )}
            </Formik>
    )
}