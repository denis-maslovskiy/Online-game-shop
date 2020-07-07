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

export const Authorization = () => {
    const { request } = useHttp();

  const submit = async (values, { setSubmitting, resetForm }) => {
    try {
        const data = await request('/api/auth/login', 'POST', {...values});
        console.log(data);
    } catch (e) {}
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .min(6, "Must be at least 6 characters")
          .required("Required"),
      })}
      onSubmit={submit}
    >
      {(props) => (
        <Form className="box">
          <h1 className="box__title">Authorization</h1>

          <CustomTextInput
            className="box__input"
            name="email"
            type="text"
            placeholder="Email"
            autoComplete="off"
          />

          <CustomTextInput
            className="box__input"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="off"
          />

          <button className="box__submit-btn" type="submit">
            {props.isSubmitting ? "Loading..." : "Log In"}
          </button>

          <div className="box__bottom-text">
            Don't have an account?{" "}
            <Link to="/registration" className="box__bottom-text__link">
              Sign up
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};
