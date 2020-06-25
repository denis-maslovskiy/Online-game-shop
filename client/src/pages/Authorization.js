import React from 'react';
import { Formik, useField, Form } from 'formik';
import * as Yup from 'yup';
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

export const Authorization = () => {

    return (
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email address'),
                    password: Yup.string().min(6, 'Must be at least 6 characters')
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setTimeout(() => {
                        console.log(JSON.stringify(values));
                        resetForm();
                        setSubmitting(false);
                    }, 3000);
                   
                }}
            >
                {props => (
                    <Form className='box'>
                        <h1>Authorization</h1>
                        
                        <CustomTextInput name='email' type='text' placeholder='Email' autoComplete='off'/>

                        <CustomTextInput name='password' type='password' placeholder='Password' autoComplete='off'/>

                        <button type='submit'>{props.isSubmitting ? 'Loading...' : 'Log In'}</button>

                        <div className='bottom-text'>
                            Don't have an account? <a href='/registration'>Sign up</a>
                        </div>
                    </Form>
                )}
            </Formik>
    )
}