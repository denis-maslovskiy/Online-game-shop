import React, { useContext, useState, useRef } from "react";
import { Formik, useField, Form } from "formik";
import * as Yup from "yup";
import ClearIcon from "@material-ui/icons/Clear";
import { Link } from "react-router-dom";
import { useHttp } from "../hooks/httpHook";
import "../styles/auth.scss";
import { AuthContext } from "../context/AuthContext";

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
  const auth = useContext(AuthContext);
  const { request, error, clearError } = useHttp();
  const [isSubmit, setIsSubmit] = useState(false);

  const submit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmit(true);
    try {
      const data = await request("/api/auth/login", "POST", { ...values });
      auth.login(data.token, data.userId);
      resetForm();
      setSubmitting(false);
    } catch (e) {}
    setTimeout(() => clearError(), 3000)
  };

  const alert = useRef();
  const clickHandler = () => {
    alert.current.classList.remove("show");
    alert.current.classList.add("hide");
  };

  return (
    <>
    {isSubmit && error &&
      <div ref={alert} className="alert alert-error show">
        <span className="alert__text">{error}</span>
        <button
          className="alert__close-btn alert__close-btn_error"
          onClick={clickHandler}
        >
          <ClearIcon />
        </button>
      </div>
    }

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
          />

          <CustomTextInput
            className="box__input"
            name="password"
            type="password"
            placeholder="Password"
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

    </>
  );
};
