import React, { useRef } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { connect } from "react-redux";
import {
  clearErrorMessage,
  clearSuccessMessage,
  clearInfoMessage,
} from "../redux/notification/notificationActions";
import "../styles/notification.scss";

const Notification = (props) => {
  const alertRef = useRef();

  const clickHandler = () => {
    alertRef.current.classList.remove("show");
    alertRef.current.classList.add("hide");
    props.clearErrorMessage();
    props.clearSuccessMessage();
    props.clearInfoMessage();
  };

  if (props.values.successMsg) {
    return (
      <div ref={alertRef} className="alert alert-success show">
        <span className="alert__text">{props.values.successMsg}</span>
        <button
          className="alert__close-btn alert__close-btn--success"
          onClick={clickHandler}
        >
          <ClearIcon />
        </button>
      </div>
    );
  }
  if (props.values.errorMsg) {
    return (
      <div ref={alertRef} className="alert alert-error show">
        <span className="alert__text">{props.values.errorMsg}</span>
        <button
          className="alert__close-btn alert__close-btn--error"
          onClick={clickHandler}
        >
          <ClearIcon />
        </button>
      </div>
    );
  }
  if (props.values.infoMsg) {
    return (
      <div ref={alertRef} className="alert alert-info show">
        <span className="alert__text">{props.values.infoMsg}</span>
        <button
          className="alert__close-btn alert__close-btn--info"
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
    clearSuccessMessage: () => dispatch(clearSuccessMessage()),
    clearInfoMessage: () => dispatch(clearInfoMessage()),
  };
};

export default connect(null, mapDispatchToProps)(Notification);
