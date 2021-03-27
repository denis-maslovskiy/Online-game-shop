import React, { useState, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { clearErrorMessage } from "../redux/notification/notificationActions";
import { registerUser } from "../redux/authentication/authenticationActions";
import Notification from "../components/Notification";
import { DependenciesContext } from "../context/DependenciesContext";
import "../styles/auth.scss";
import "../styles/notification.scss";

const schema = Yup.object({
  username: Yup.string()
    .min(3, "Must be at least 3 characters")
    .max(15, "Must be no more than 15 characters")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email address"
    )
    .required("Required"),
  password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
});

const Registration = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const { isAuthenticated } = useContext(DependenciesContext);
  const WITH_SUCH_NAME = "with such name", WITH_SUCH_EMAIL = "with such email";

  const { errorMsg, successMsg, registerUser, clearErrorMessage } = props;

  const onInputClickHandler = () => {
    clearErrorMessage();
  };

  const submit = (userData, { setSubmitting, resetForm }) => {
    registerUser(userData, resetForm);
    setIsSubmitting(true);
    setSubmitting(false);
  };

  if (isAuthenticated) {
    history.push("/");
    return null;
  }

  const checksForUsername = (errors, touched) => {
    return (Boolean(errors.username) && touched.username) || Boolean(errorMsg && errorMsg.includes(WITH_SUCH_NAME));
  }

  const usernameHelperText = (errors, touched) => {
    return checksForUsername(errors, touched) ? (Boolean(errorMsg) ? errorMsg : errors.username) : "";
  }

  const checksForEmail = (errors, touched) => {
    return (Boolean(errors.email) && touched.email) || Boolean(errorMsg && errorMsg.includes(WITH_SUCH_EMAIL));
  };

  const emailHelperText = (errors, touched) => {
    return checksForEmail(errors, touched) ? (Boolean(errorMsg) ? errorMsg : errors.email) : "";
  };

  const checkForSubmitButton = (errors, touched, values) => {
    return (
      Boolean(checksForEmail(errors, touched)) ||
      Boolean(checksForUsername(errors, touched)) ||
      Boolean(!values.email) ||
      Boolean(!values.password) || 
      Boolean(!values.username)
    );
  };

  return (
    <>
      {isSubmitting && successMsg && <Notification values={{ successMsg, errorMsg }} />}
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={schema}
        onSubmit={submit}
      >
        {({ handleChange, handleBlur, isSubmitting, errors, touched, values }) => (
          <Form className="box">
            <h1 className="box__title titles">Registration</h1>

            <div className="form__div">
              <TextField
                className="form__input auth-input"
                required
                label="Username"
                variant="filled"
                name="username"
                autoComplete="off"
                value={values.username || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                onClick={onInputClickHandler}
                error={Boolean(checksForUsername(errors, touched))}
                helperText={usernameHelperText(errors, touched)}
              />
            </div>

            <div className="form__div">
              <TextField
                className="form__input auth-input"
                required
                label="Email"
                variant="filled"
                name="email"
                autoComplete="off"
                value={values.email || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                onClick={onInputClickHandler}
                error={Boolean(checksForEmail(errors, touched))}
                helperText={emailHelperText(errors, touched)}
              />
            </div>

            <div className="form__div">
              <TextField
                className="form__input auth-input"
                required
                label="Password"
                variant="filled"
                name="password"
                type="password"
                autoComplete="off"
                value={values.password || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                onClick={onInputClickHandler}
                error={Boolean(errors.password) && touched.password}
                helperText={touched.password ? errors.password : ""}
              />
            </div>
            <button className="box__submit-btn titles" type="submit" disabled={checkForSubmitButton(errors, touched, values)}>
              {isSubmitting ? "Loading..." : "Sign Up"}
            </button>
            <div className="box__bottom-text default-text">
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerUser: (userData, resetForm) => dispatch(registerUser(userData, resetForm)),
    clearErrorMessage: () => dispatch(clearErrorMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
