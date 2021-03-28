import React, { useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { clearErrorMessage } from "../redux/notification/notificationActions";
import { loginUser } from "../redux/authentication/authenticationActions";
import { DependenciesContext } from "../context/DependenciesContext";
import "../styles/auth.scss";

const Authorization = (props) => {
  const { loginUser, clearErrorMessage, errorMsg } = props;
  const history = useHistory();
  const { isAuthenticated } = useContext(DependenciesContext);
  const USER = "User", PASSWORD = 'password';

  const onInputClickHandler = () => {
    clearErrorMessage();
  };

  const submit = (userData, { setSubmitting, resetForm }) => {
    loginUser(userData, resetForm);
    setSubmitting(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [isAuthenticated, history]);

  const checksForEmail = (errors, touched) => {
    return (Boolean(errors.email) && touched.email) || Boolean(errorMsg && errorMsg.includes(USER));
  };

  const emailHelperText = (errors, touched) => {
    return checksForEmail(errors, touched) ? (Boolean(errorMsg) ? errorMsg : errors.email) : "";
  };

  const checksForPassword = (errors, touched) => {
    return (Boolean(errors.password) && touched.password) || Boolean(errorMsg && errorMsg.includes(PASSWORD));
  };

  const passwordHelperText = (errors, touched) => {
    return checksForPassword(errors, touched) ? (Boolean(errorMsg) ? errorMsg : errors.password) : "";
  };

  const checkForSubmitButton = (errors, touched, values) => {
    return (
      Boolean(checksForEmail(errors, touched)) ||
      Boolean(checksForPassword(errors, touched)) ||
      Boolean(!values.email) ||
      Boolean(!values.password)
    );
  };

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .matches(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              "Invalid email address"
            )
            .required("Required"),
          password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
        })}
        onSubmit={submit}
      >
        {({ handleChange, handleBlur, isSubmitting, errors, touched, values }) => (
          <Form className="box">
            <h1 className="box__title titles">Authorization</h1>

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
                error={Boolean(checksForPassword(errors, touched))}
                helperText={passwordHelperText(errors, touched)}
              />
            </div>
            <button
              className="box__submit-btn titles"
              type="submit"
              disabled={checkForSubmitButton(errors, touched, values)}
            >
              {isSubmitting ? "Loading..." : "Log In"}
            </button>
            <div className="box__bottom-text default-text">
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
    loginUser: (userData, resetForm) => dispatch(loginUser(userData, resetForm)),
    clearErrorMessage: () => dispatch(clearErrorMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authorization);
