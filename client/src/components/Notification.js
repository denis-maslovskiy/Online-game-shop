import React, { useRef } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { connect } from "react-redux";
import { clearErrorMessage, clearSuccessMessage, clearInfoMessage } from "../redux/notification/notificationActions";
import "../styles/notification.scss";

const Notification = ({ clearErrorMessage, clearSuccessMessage, clearInfoMessage, values }) => {
  const alertRef = useRef();

  const clickHandler = () => {
    alertRef.current.classList.remove("alert--show");
    alertRef.current.classList.add("alert--hide");
    clearErrorMessage();
    clearSuccessMessage();
    clearInfoMessage();
  };

  return (
    <div className="notification-container">
      {values.successMsg && (
        <div ref={alertRef} className="alert alert-success alert--show">
          <span className="alert__text">{values.successMsg}</span>
          <button className="alert__close-btn alert__close-btn--success" onClick={clickHandler}>
            <ClearIcon />
          </button>
        </div>
      )}
      {values.errorMsg && (
        <div ref={alertRef} className="alert alert-success alert--show">
          <span className="alert__text">{values.successMsg}</span>
          <button className="alert__close-btn alert__close-btn--success" onClick={clickHandler}>
            <ClearIcon />
          </button>
        </div>
      )}
      {values.infoMsg && (
        <div ref={alertRef} className="alert alert-info alert--show">
          <span className="alert__text">{values.infoMsg}</span>
          <button className="alert__close-btn alert__close-btn--info" onClick={clickHandler}>
            <ClearIcon />
          </button>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearErrorMessage: () => dispatch(clearErrorMessage()),
    clearSuccessMessage: () => dispatch(clearSuccessMessage()),
    clearInfoMessage: () => dispatch(clearInfoMessage()),
  };
};

export default connect(null, mapDispatchToProps)(Notification);
