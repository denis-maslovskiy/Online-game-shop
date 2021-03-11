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
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
});

const Registration = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const { isAuthenticated } = useContext(DependenciesContext);

  const { errorMsg, successMsg, registerUser, clearErrorMessage } = props;

  const onInputClickHandler = () => {
    clearErrorMessage();
  };

  const submit = (userData, { setSubmitting, resetForm }) => {
    registerUser(userData);
    setIsSubmitting(true);
    resetForm({});
    setSubmitting(false);
  };

  if (isAuthenticated) {
    history.push("/");
    return null;
  }

  return (
    <>
      {isSubmitting && errorMsg && <Notification values={{ successMsg, errorMsg }} />}
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
            <h1 className="box__title">Registration</h1>

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
                error={Boolean(errors.username) && touched.username}
                helperText={touched.username ? errors.username : ""}
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
                error={Boolean(errors.email) && touched.email}
                helperText={touched.email ? errors.email : ""}
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
            <button className="box__submit-btn" type="submit">
              {isSubmitting ? "Loading..." : "Sign Up"}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerUser: (userData) => dispatch(registerUser(userData)),
    clearErrorMessage: () => dispatch(clearErrorMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
