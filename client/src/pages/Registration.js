import React, { useState, useRef, useContext } from "react";
import { Formik, useField, Form } from "formik";
import * as Yup from "yup";
import ClearIcon from "@material-ui/icons/Clear";
import { Link } from "react-router-dom";
// import { useHttp } from "../hooks/httpHook";
import "../styles/auth.scss";
import "../styles/alert.scss";

import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { connect } from 'react-redux';
import { registerUser, errorMessage } from '../redux/alert/alertActions';

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

const Alert = ({ status }) => {
  const alert = useRef();

  const clickHandler = () => {
    alert.current.classList.remove("show");
    alert.current.classList.add("hide");
  };

  if (status === "User created") {
    return (
      <div ref={alert} className="alert alert-success show">
        <span className="alert__text">{status}! Now you can Log In.</span>
        <button
          className="alert__close-btn alert__close-btn_success"
          onClick={clickHandler}
        >
          <ClearIcon />
        </button>
      </div>
    );
  } else {
    return (
      <div ref={alert} className="alert alert-error show">
        <span className="alert__text">{status}</span>
        <button
          className="alert__close-btn alert__close-btn_error"
          onClick={clickHandler}
        >
          <ClearIcon />
        </button>
      </div>
    );
  }
};

const Registration = (props) => {

  const auth = useContext(AuthContext);

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

  const { errorMsg, successMsg, registerUser, } = props;

  const submit = async (userData, { setSubmitting, resetForm }) => {
    registerUser(userData);
    console.log('error: ', errorMsg, 'success: ', successMsg)

    // Добавить login (автологи)
    // auth.login();

    resetForm();
    setSubmitting(false);
  };

  return (
    <>


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

            <button className="box__submit-btn" type="submit">
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

      <div>{successMsg}, {errorMsg}</div>
    </>
  );
};

const mapStateToProps = (state) => {
  // console.log('state: ',state);
  return {
    errorMsg: state.alert.errorMsg,
    successMsg: state.alert.successMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerUser: (userData) => dispatch(registerUser(userData)), // Добавить history
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);