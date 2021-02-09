import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import * as Yup from "yup";
import { Field, Form, Formik, FieldProps } from "formik";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  updateAchievementData,
  getAllAchievements,
  deleteAchievement,
} from "../../redux/achievement/achievementActions";
import Notification from "../../components/Notification";

interface FormValues {
  achievementTopic: string;
  achievementName: string;
  achievementText: string;
  achievementValue: number;
  estimatedDiscountForTheClient: number;
  _id: string;
}

interface IProps {
  initialAchievementData: FormValues;
  deleteAchievementClickHandler: (id: string) => void;
}

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

const initialEmptyForm = {
  achievementTopic: "",
  achievementName: "",
  achievementText: "",
  achievementValue: 0,
  estimatedDiscountForTheClient: 0,
  _id: "",
};

const RenderAchievementForm = ({ initialAchievementData, deleteAchievementClickHandler }: IProps) => {
  const dispatch = useDispatch();
  return (
    <>
      <h2>Edit Achievement</h2>
      <Formik
        initialValues={{
          achievementTopic: initialAchievementData.achievementTopic,
          achievementName: initialAchievementData.achievementName,
          achievementText: initialAchievementData.achievementText,
          achievementValue: initialAchievementData.achievementValue,
          estimatedDiscountForTheClient: initialAchievementData.estimatedDiscountForTheClient,
          _id: initialAchievementData._id,
        }}
        onSubmit={(values) => {
          const { userId } = JSON.parse(localStorage.getItem("userData")!);
          dispatch(updateAchievementData(values._id, { ...values, userId }));
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ values }) => (
          <Form>
            {inputs.map((input) => {
              return (
                <Field key={input.name} name={input.name}>
                  {({ field }: FieldProps<FormValues>) => (
                    <div>
                      <TextField {...field} required label={input.label} variant="outlined" />
                    </div>
                  )}
                </Field>
              );
            })}
            <button type="submit">Save changes</button>
            <button type="button" onClick={() => deleteAchievementClickHandler(values._id)}>
              Delete achievement
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

const AdminEditAchievement: React.FC = () => {
  const dispatch = useDispatch();
  const { allAchievements } = useSelector((state: RootState) => state.achievement);
  const { successMsg, infoMsg, errorMsg } = useSelector((state: RootState) => state.notification);
  const [initialAchievementData, setInitialAchievementData] = useState(initialEmptyForm);

  useEffect(() => {
    dispatch(getAllAchievements());
  }, []);

  const selectHandleChange = (event: React.FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    const achievementId = event.target.value;
    // @ts-ignore
    const achievementData = allAchievements.find((achieve) => {
      return achieve._id === achievementId;
    });

    setInitialAchievementData(achievementData);
  };

  const deleteAchievementClickHandler = async (achievementId: string) => {
    const { userId } = JSON.parse(localStorage.getItem("userData")!);
    dispatch(deleteAchievement(achievementId, { userId }));
  };

  return (
    <>
      <FormControl>
        <InputLabel>Select achievement</InputLabel>
        {/* @ts-ignore */}
        <Select value={initialAchievementData?._id} onChange={selectHandleChange}>
          {allAchievements.map((achieve: FormValues) => {
            return (
              <MenuItem value={achieve._id} key={achieve._id}>
                {achieve.achievementText}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {successMsg && <Notification values={{ successMsg }} />}
      {infoMsg && <Notification values={{ infoMsg }} />}
      {errorMsg && <Notification values={{ errorMsg }} />}
      {initialAchievementData && (
        <RenderAchievementForm
          initialAchievementData={initialAchievementData}
          deleteAchievementClickHandler={deleteAchievementClickHandler}
        />
      )}
    </>
  );
};

export default AdminEditAchievement;
