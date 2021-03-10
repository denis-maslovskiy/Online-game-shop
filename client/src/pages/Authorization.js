import React, { useState, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import Notification from "../components/Notification";
import { clearErrorMessage } from "../redux/notification/notificationActions";
import { loginUser } from "../redux/authentication/authenticationActions";
import { DependenciesContext } from "../context/DependenciesContext";
import "../styles/auth.scss";

const Authorization = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser, clearErrorMessage, errorMsg } = props;
  const history = useHistory();
  const { isAuthenticated } = useContext(DependenciesContext);

  const onInputClickHandler = () => {
    clearErrorMessage();
  };

  const submit = (userData, { setSubmitting, resetForm }) => {
    loginUser(userData);
    setIsSubmitting(true);
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [isAuthenticated, history]);

  return (
    <>
      {isSubmitting && errorMsg && <Notification values={{ errorMsg }} />}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid email address").required("Required"),
          password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
        })}
        onSubmit={submit}
      >
        {({handleChange, handleBlur, isSubmitting, errors, touched}) => (
          <Form className="box">
            <h1 className="box__title">Authorization</h1>

            <div className="form__div">
              <TextField
                className="form__input auth-input"
                required
                label="Email"
                variant="filled"
                name="email"
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                onClick={onInputClickHandler}
                error={Boolean(errors.email)}
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
                onChange={handleChange}
                onBlur={handleBlur}
                onClick={onInputClickHandler}
                error={Boolean(errors.password)}
                helperText={touched.password ? errors.password : ""}
              />
            </div>
            <button className="box__submit-btn" type="submit">
              {isSubmitting ? "Loading..." : "Log In"}
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
