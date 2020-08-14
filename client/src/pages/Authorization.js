import React, { useState, useEffect } from "react";
import { Formik, useField, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Notification from "../components/Notification";
import { useAuth } from "../hooks/authHook";
import { clearErrorMessage } from "../redux/notification/notificationActions";
import { loginUser } from "../redux/authentication/authenticationActions";
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

const Authorization = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser, clearErrorMessage, errorMsg } = props;
  const history = useHistory();
  const { isAuthenticated } = useAuth();

  const onInputClickHandler = () => {
    clearErrorMessage();
  };

  const submit = async (userData, { setSubmitting, resetForm }) => {
    loginUser(userData);
    setIsSubmitting(true);
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if(isAuthenticated){
      history.push("/");
    }
  }, [isAuthenticated])

  return (
    <>
      {isSubmitting && errorMsg && <Notification values={{ errorMsg }} />}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
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

const mapStateToProps = (state) => {
  return {
    errorMsg: state.notification.errorMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (userData) => dispatch(loginUser(userData)),
    clearErrorMessage: () => dispatch(clearErrorMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authorization);
