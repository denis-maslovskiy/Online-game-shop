import React from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import TextField from "@material-ui/core/TextField";
import { Form, Formik, FormikErrors, FormikTouched } from "formik";
import { addAchievement } from "../../redux/achievement/achievementActions";
import Notification from "../../components/Notification";

const validationSchema = Yup.object().shape({
  achievementTopic: Yup.string().required("Achievement topic name is required"),
  achievementName: Yup.string().required("Achievement name description is required"),
  achievementText: Yup.string().required("Achievement text date is required"),
  achievementValue: Yup.number().required("Achievement value is required"),
  estimatedDiscountForTheClient: Yup.number().required("Estimated discount for the client is required"),
});

const inputs = [
  { label: "Achievement topic", name: "achievementTopic" },
  { label: "Achievement name", name: "achievementName" },
  { label: "Achievement text", name: "achievementText" },
  { label: "Achievement value", name: "achievementValue" },
  { label: "Estimated discount for the client", name: "estimatedDiscountForTheClient" },
];

const checksForButton = (isSubmitting: boolean, errors: FormikErrors<any>, touched: FormikTouched<any>) => {
  return (
    isSubmitting ||
    Boolean(errors.achievementTopic && touched.achievementTopic) ||
    Boolean(errors.achievementName && touched.achievementName) ||
    Boolean(errors.achievementText && touched.achievementText) ||
    Boolean(errors.achievementValue && touched.achievementValue) ||
    Boolean(errors.estimatedDiscountForTheClient && touched.estimatedDiscountForTheClient)
  );
};

const initialValues = {
  achievementTopic: "",
  achievementName: "",
  achievementText: "",
  achievementValue: 0,
  estimatedDiscountForTheClient: 0,
};

const AdminAddAchievement = () => {
  const dispatch = useDispatch();
  const {successMsg, errorMsg} = useSelector((state: RootState) => state.notification);

  return (
    <>
      {successMsg && <Notification values={{successMsg}}/>}
      {errorMsg && <Notification values={{errorMsg}}/>}
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          const { userId } = JSON.parse(localStorage.getItem("userData")!);
          dispatch(addAchievement({ ...values, userId }));
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {({ errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            {inputs.map((input) => {
              return (
                <div key={input.name}>
                  <TextField
                    required
                    label={input.label}
                    variant="outlined"
                    multiline
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name={input.name}
                  />
                </div>
              );
            })}
            <button type="submit" disabled={checksForButton(isSubmitting, errors, touched)}>
              Add achievement
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AdminAddAchievement;
