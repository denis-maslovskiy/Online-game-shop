import React from "react";
import { Formik, useField, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useHttp } from '../hooks/httpHook';
import "../styles/auth.scss";

const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </>
  );
};

export const Registration = () => {
    const {loading, request} = useHttp();

  const schema = Yup.object({
    username: Yup.string()
      .min(3, "Must be at least 3 characters")
      .max(15, "Must be no more than 15 characters")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Required"),
  });

  const submit = async (values, { setSubmitting, resetForm }) => {
    try {
        const data = await request('/api/auth/registration', 'POST', {...values});
        console.log('Data: ', data);
        resetForm();
        setSubmitting(false);
    } catch (e) {}
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
      }}
      validationSchema={schema}
      onSubmit={submit}
    >
      {(props) => (
        <Form className="box">
          <h1 className="box__title">Registration</h1>

          <CustomTextInput
            className="box__input"
            name="username"
            type="text"
            placeholder="Username"
          />

          <CustomTextInput
            className="box__input"
            name="email"
            type="text"
            placeholder="Email"
          />

          <CustomTextInput
            className="box__input"
            name="password"
            type="password"
            placeholder="Password"
          />

          <button className="box__submit-btn" type="submit" disabled={loading}>
            {props.isSubmitting ? "Loading..." : "Sign Up"}
          </button>

          <div className="box__bottom-text">
            Have an account?{" "}
            <Link to="/authorization" className="box__bottom-text__link">
              Log in
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};
