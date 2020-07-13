import React, { useRef } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { connect } from "react-redux";
import { clearErrorMessage } from "../redux/notification/notificationActions";

const Notification = (props) => {
  const alertRef = useRef();

  const clickHandler = () => {
    alertRef.current.classList.remove("show");
    alertRef.current.classList.add("hide");
    props.clearErrorMessage();
  };

  if (props.values.successMsg) {
    return (
      <div ref={alertRef} className="alert alert-success show">
        <span className="alert__text">
          {props.values.successMsg}! Now you can Log In.
        </span>
        <button
          className="alert__close-btn alert__close-btn_success"
          onClick={clickHandler}
        >
          <ClearIcon />
        </button>
      </div>
    );
  } else if (props.values.errorMsg) {
    return (
      <div ref={alertRef} className="alert alert-error show">
        <span className="alert__text">{props.values.errorMsg}</span>
        <button
          className="alert__close-btn alert__close-btn_error"
          onClick={clickHandler}
        >
          <ClearIcon />
        </button>
      </div>
    );
  } else return null;
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearErrorMessage: () => dispatch(clearErrorMessage()),
  };
};

export default connect(null, mapDispatchToProps)(Notification);
