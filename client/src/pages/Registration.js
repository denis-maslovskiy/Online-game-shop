import React, { useState, useContext } from "react";
import { Formik, useField, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useAuth } from '../hooks/authHook';
import { clearErrorMessage } from "../redux/notification/notificationActions";
import { registerUser } from "../redux/authentication/authenticationActions";
import Notification from "../components/Notification";
import "../styles/auth.scss";
import "../styles/notification.scss";

import login from '../redux/helpers/loginHelper';

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

const Registration = (props) => {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const { isAuthenticated } = useAuth();

  const { errorMsg, successMsg, registerUser, clearErrorMessage, userId, token } = props;

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

  const onInputClickHandler = () => {
    clearErrorMessage();
  };

  const submit = async (userData, { setSubmitting, resetForm }) => {
    try {
      // const data = await registerUser(userData);
      // auth.logout();
      registerUser(userData);
      console.log('token: ', token, 'userId: ', userId);
      // auth.login(token, userId)
      login(token, userId);
      // if (data) {
      //   auth.login(data.token, data.userId);
      //   history.push("/");
      // }
      setIsSubmitting(true);
      resetForm();
      setSubmitting(false);
    } catch (e) {
      throw new Error(e);
    }
  };

  if(isAuthenticated) {
    history.push('/');
    return null;
  }

  return (
    <>
      {isSubmitting && errorMsg && (
        <Notification values={{ successMsg, errorMsg }} />
      )}
      {isSubmitting && successMsg && (
        <Notification values={{ successMsg, errorMsg }} />
      )}
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
              onClick={onInputClickHandler}
            />
            <CustomTextInput
              className="box__input"
              name="email"
              type="text"
              placeholder="Email"
              onClick={onInputClickHandler}
            />
            <CustomTextInput
              className="box__input"
              name="password"
              type="password"
              placeholder="Password"
              onClick={onInputClickHandler}
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
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    errorMsg: state.notification.errorMsg,
    successMsg: state.notification.successMsg,
    token: state.authentication.token,
    userId: state.authentication.userId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerUser: (userData) => dispatch(registerUser(userData)),
    clearErrorMessage: () => dispatch(clearErrorMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
